# DEVLOG

## 2026-10-07 — Local Postgres via Docker

**Files touched**
- `.env`, `.env.local` (gitignored): `DATABASE_URL` now `postgresql://postgres:postgres@127.0.0.1:5432/beat_battles?sslmode=disable`

**Decisions**
- Replaced the dead Prisma dev DB (127.0.0.1:51214) with a plain Docker container:
  `docker run -d --name beat-battles-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=beat_battles -p 5432:5432 -v beat-battles-pgdata:/var/lib/postgresql/data postgres:17`
- Schema loaded with `docker exec -i beat-battles-db psql -U postgres -d beat_battles < db/schema.sql`; DB starts empty (no data migrated from the Prisma dev DB).
- Host port 5432 is shared with the `communityhq_postgres` container (restart policy `unless-stopped`); only one can run at a time. Switch to `-p 5433:5432` if both are needed.

**Next steps**
- Remove leftover `//DATABASE_URL_for_Prisma` comment and `SHADOW_DATABASE_URL` from `.env.local`.
- Create a battle via the admin page and smoke-test submit/vote flow.
- Consider a `docker-compose.yml` + `.env.example` so the DB setup lives in the repo.

## 2026-10-03 — Replace Prisma with raw PostgreSQL (`pg`)

**Files touched**
- Added `lib/db.ts` (pg Pool, `query`, `transaction`, `newId`, `getSubmissionsWithVotes`, row types)
- Rewrote data access in `app/admin/page.tsx`, `app/page.tsx`, `app/submit/page.tsx`, `app/past-battles/page.tsx`, `app/past-battles/[slug]/page.tsx`, `app/api/battles/current/route.ts`, `app/api/votes/create/route.ts`, `app/api/submissions/{route,me/route,create/route,finalize/route}.ts`, `components/_sections/home/LatestWinner.tsx`, `components/_sections/submitbeat/ListenVote.tsx`
- Removed `prisma/`, `generated/prisma/`, `prisma.config.ts`, `lib/prisma.ts`; removed `prisma`, `@prisma/client`, `@prisma/adapter-pg` deps
- Moved init migration to `db/schema.sql`

**Decisions**
- Kept the existing schema (quoted PascalCase tables/camelCase columns) so the current DB works unchanged.
- New IDs use `crypto.randomUUID()` (Prisma used client-side cuids; columns are TEXT, so both coexist).
- `TIMESTAMP` columns are treated as UTC: session `timezone=UTC`, UTC type parser for OID 1114, `parseInputDatesAsUTC`.
- `Battle.updatedAt` / `Vote.updatedAt` are set explicitly with `NOW()` (Prisma's `@updatedAt` was client-side).
- Winner selection now runs in a transaction; vote upsert uses `ON CONFLICT ("userId","battleId")`.

**Next steps**
- Smoke-test against a running DB (local Postgres on 127.0.0.1:51214 was down during this session).
- Apply schema changes via plain SQL files in `db/` going forward; `_prisma_migrations` table can be dropped.
