System Design Interview: "Design Beat Battles"

This is based on the repo's actual code (apps/web, plus an empty apps/ws-server stub). I've split it into what the code does today and what you'd design at scale, because an interviewer will probe the gap.

1. The prompt

▎ Design a weekly online competition where music producers upload a beat, the community listens and votes, and an admin crowns a winner. Past battles stay browsable.

2. Requirements

Functional

- Admin creates a battle with a title, slug and deadline (the code hardcodes 14 days).
- Authenticated users upload one MP3 or WAV (max 10 MB) per battle.
- Users listen to entries and cast one vote per battle. They can change it, and can't vote for their own beat.
- Voting is blocked once the battle is closed.
- The admin selects a winner. The homepage shows the current battle and latest winner, and a history page lists past battles.

Non-functional

- Audio files are large, so they must not flow through app servers.
- Uploads and playback must be access-controlled.
- Vote integrity: one vote per user per battle, even under concurrent requests.
- Reads far outnumber writes (browsing and listening vs. uploading and voting).
- Cheap to run, with an upgrade path to scale.

Out of scope: payments, audio transcoding, social features.

3. Back-of-envelope estimates

These are my assumptions, not repo data. Adjust them in the interview.

- 100k MAU, 5k participants per weekly battle, 50k voters.
- Storage: 5k × ~8 MB ≈ 40 GB/week, about 2 TB/year. This is cheap in S3 and the dominant cost.
- Votes: 50k per week, bursty near the deadline. Peak maybe 50 writes/sec, which is trivial for Postgres.
- Playback: 50k listeners × ~20 tracks × 8 MB = 8 TB/week egress. This is the real scaling and cost problem, and it's why you'd use a CDN.
- Metadata is tiny (rows of a few hundred bytes), so a single Postgres instance handles it for a long time.

4. High-level architecture (as built)

Browser (React 19 / Next.js App Router)
│ ├── Server Components → query Postgres directly
│ ├── Route Handlers (/api/\*) → JSON
│ └── Server Actions (admin) → mutate + revalidatePath
│
├── Clerk (auth: sessions, JWT, middleware in proxy.ts)
├── Next.js server ──► PostgreSQL 17 (pg Pool)
└── Next.js server ──► S3 (only signs URLs)
Browser ──────────────► S3 directly (upload via presigned PUT, playback via presigned GET)

┌───────────┬──────────────────────┬──────────────────────┐
│ Concern │ Choice │ Why it's reasonable │
├───────────┼──────────────────────┼──────────────────────┤
│ App │ │ One deployable, SSR │
│ framework │ Next.js 16, monolith │ plus API in a single │
│ │ │ codebase │
├───────────┼──────────────────────┼──────────────────────┤
│ │ │ Offloads identity, │
│ Auth │ Clerk │ sessions and │
│ │ │ password security │
├───────────┼──────────────────────┼──────────────────────┤
│ │ │ Relational data with │
│ Metadata │ Postgres 17 via pg │ real integrity │
│ │ │ needs │
├───────────┼──────────────────────┼──────────────────────┤
│ Blobs │ S3 │ Cheap, durable and │
│ │ │ scalable │
├───────────┼──────────────────────┼──────────────────────┤
│ Local dev │ Docker Compose │ Reproducible setup │
│ │ Postgres │ │
├───────────┼──────────────────────┼──────────────────────┤
│ │ npm workspaces │ ws-server is a │
│ Monorepo │ (apps/web, │ placeholder for │
│ │ apps/ws-server) │ real-time features │
└───────────┴──────────────────────┴──────────────────────┘

5. Data model

Three tables:

Battle(id, title, slug UNIQUE, status open|closed, startsAt, endsAt, hiddenFromHistory)
Submission(id, userId, username, battleId→Battle, fileKey UNIQUE, fileUrl, fileName,
fileSize, mimeType, placement) UNIQUE(userId, battleId)
Vote(id, userId, battleId→Battle, submissionId→Submission) UNIQUE(userId, battleId)

Design points to call out

- Constraints do the correctness work. UNIQUE(userId, battleId) on Submission and Vote enforces one entry and one vote per battle at the database level, not just in application code.
- ON DELETE CASCADE keeps data consistent when a battle is deleted.
- Vote changes are an upsert: INSERT ... ON CONFLICT (userId, battleId) DO UPDATE SET submissionId = .... It's atomic and idempotent, with no read-then-write race.
- No user table. userId is Clerk's ID, and username is denormalized onto Submission at upload time. That avoids a join and a sync job, but the name goes stale if the user changes it.
- placement is an integer on Submission. Only 1 is used today, so the design could extend to 2nd and 3rd.
- Times are stored as UTC TIMESTAMP, with the session pinned to UTC and a custom type parser. That avoids timezone drift.

6. Core flows

A. Upload (the key deep dive)

1. POST /api/submissions/create {battleId, fileName, type, size}
   → check auth, MIME allowlist, size ≤ 10 MB, no existing submission
   → return presigned PUT URL (60 s expiry) + fileKey
2. Browser PUTs the file straight to S3
3. POST /api/submissions/finalize {fileKey, ...}
   → re-check auth and duplicate, INSERT Submission row

Why this design: the file never touches the app server. That saves bandwidth, avoids serverless request-size and timeout limits, and scales independently. The short URL expiry limits abuse. Object keys (submissions/{battleId}/{userId}/{ts}-{name}) are namespaced and sanitized.

B. Voting

POST /api/votes/create runs these checks in order: authenticated, battle exists, battle open, submission belongs to that battle, not the voter's own beat. Then it upserts. Vote counts are derived at read time by loading votes and counting them in application code.

C. Playback

The client asks for a presigned GET URL (5-minute expiry), then streams from S3. The bucket can stay private.

D. Admin and reads

- /admin is a Server Component that checks the user's ID against an ADMIN_USER_IDS env allowlist.
- Server Actions create battles, open or close them, hide them from history, and pick a winner. Selecting a winner clears all placements for the battle and sets the new one inside a transaction.
- After mutations, revalidatePath refreshes the cached pages.
- Reads happen on the server through a small query() helper. getSubmissionsWithVotes fetches submissions and votes in parallel and stitches them in memory, avoiding N+1 queries.

7. Deep dives an interviewer may ask about

1. Why presigned URLs? They keep large files off app servers and offload bandwidth to S3. Access control is enforced by signing.
1. How do you prevent double voting? A DB unique constraint plus an atomic upsert, not "check then insert."
1. Where does validation live? In three places: the client for UX, the API for security, and ideally S3 conditions for hard enforcement (see weaknesses).
1. Auth boundary: middleware (proxy.ts) protects page routes, but each API handler also calls auth() itself. The route matcher only lists /dashboard, /upload and /profile, none of which exist, so the handlers' own checks are what protect the APIs.

1. Weaknesses in the current design

Interviewers like candidates who find the holes. These came from reading the code.

Issue: Finalize trusts the client. It never verifies the object
exists in S3, that the fileKey is under the user's own prefix,
or that size and type match. A user could register any
fileKey, including someone else's file.
Where: submissions/finalize
Fix: HeadObject before insert, and derive the key and URL
server-side.
────────────────────────────────────────
Issue: Finalize doesn't check the battle exists or is open.
Where: same
Fix: Validate server-side, as the vote route does.
────────────────────────────────────────
Issue: TOCTOU on submit. Check-then-insert can race. The unique
index prevents duplicates but returns a 500, not a 409.
Where: create and finalize
Fix: Catch the unique-violation error and map it to 409.
────────────────────────────────────────
Issue: Declared size and type aren't enforced by S3. A client
can lie, then upload something different.
Where: create
Fix: Use a presigned POST with content-length-range, or validate
after upload.
────────────────────────────────────────
Issue: Playback has no authorization beyond login. Any logged-in
user can sign any fileKey, including keys from other battles.
Where: playback
Fix: Verify the key exists in Submission, and that the battle is
open or the user is allowed to hear it.
────────────────────────────────────────
Issue: Broken wiring: the player calls /api/playback, but the
route lives at /api/submissions/playback.
Where: ListenVote.tsx
Fix: Fix the path.
────────────────────────────────────────
Issue: Vote counts load all vote rows per battle, then count in
memory.
Where: getSubmissionsWithVotes
Fix: SELECT submissionId, COUNT(\*) ... GROUP BY.
────────────────────────────────────────
Issue: Missing indexes. Queries filter on Battle.status,
Submission.battleId and Vote.battleId. The unique indexes
cover only some of those.
Where: schema.sql
Fix: Add indexes on Battle(status, createdAt DESC),
Submission(battleId) and Vote(battleId, submissionId).
────────────────────────────────────────
Issue: Deadlines aren't enforced. Closing a battle is a manual
admin action, and endsAt isn't checked on vote or submit.
Where: admin, votes
Fix: Enforce endsAt on the server, and add a scheduler to
auto-close.
────────────────────────────────────────
Issue: Credentials and tooling. The S3 client uses static IAM
keys, and there's an s3-test route in the app.
Where: lib/s3.ts
Fix: Use IAM roles, remove the test route.
────────────────────────────────────────
Issue: ws-server is empty, so there's no real-time layer yet.
Where: apps/ws-server
Fix: See section 9.

9. Scaling and evolution

1. CDN for audio: put CloudFront in front of S3 with signed URLs or cookies. This is the biggest cost and latency win, since egress dominates.
1. Vote counts: keep them in Postgres with an index, or maintain a counter table or Redis INCR. Cache per-battle tallies with a short TTL. Postgres handles the write rate easily, so don't prematurely shard.
1. Real-time leaderboard (the ws-server intent): servers push live vote counts over WebSockets, fed by Redis pub/sub or Postgres LISTEN/NOTIFY. Trade-off: live counts invite bandwagon voting, so you might hide counts until the battle closes.
1. Reads: the homepage and history pages are cache-friendly. Use ISR or revalidate (already partly done), and add read replicas if needed.
1. Async post-processing: after upload, an S3 event goes to a queue (SQS) and a worker validates the audio, extracts duration, makes a 30-second preview or normalized MP3, and scans for abuse. Show entries as "processing" until done.
1. Fraud and abuse: rate limits per IP and user, account-age requirements, and CAPTCHA at vote time. Clerk gives identity, but one person can still make many accounts. Duplicate-audio hashing (store a SHA-256) catches resubmits.
1. Scheduling: a cron job or queue-delayed job closes battles at endsAt, tallies the winner and triggers notifications.
1. Multi-region or high availability: managed Postgres (RDS or Aurora) with Multi-AZ, and S3 is already durable. Serverless Postgres pooling (PgBouncer) matters because each serverless instance opens its own pool.

1. Trade-offs to articulate

- Monolith vs. microservices: a monolith is the right call at this size. Split out media processing and real-time only when their load profiles diverge.
- Raw SQL vs. an ORM: the project dropped Prisma for pg, gaining control and fewer dependencies, but losing type-safe queries and migrations (migrations are now hand-written SQL files).
- Denormalized username: faster reads, but potentially stale.
- Direct-to-S3 upload: scalable, but the integrity checks move to a finalize step that must be done carefully.
- Manual winner selection vs. most votes: admin control allows moderation and judging, but adds a human bottleneck and a trust problem. A hybrid (votes shortlist, a judge decides) is common.

11. How I'd present it in 45 minutes

1. Clarify (5 min): scope, scale, one vote per user.
1. Estimates (3 min): storage and egress are the story.
1. API and data model (7 min): the three tables and unique constraints.
1. High-level design (10 min): the diagram above.
1. Deep dive (12 min): presigned upload, vote integrity, playback authorization.
1. Scale and failure modes (8 min): CDN, queue, caching, real-time.

I can write this up as a shareable doc or one-page cheat sheet, draw an architecture diagram, or write a set of follow-up interview questions with model answers. I can also fix the issues in section 8 if you want to use the code as a "find the bugs" exercise.
