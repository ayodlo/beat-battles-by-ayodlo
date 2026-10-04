# DEVLOG

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
