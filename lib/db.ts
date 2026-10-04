import pg, { Pool, type PoolClient, type QueryResultRow } from "pg";

// Columns are TIMESTAMP (no time zone) holding UTC values. Read them as UTC and
// serialize JS Dates as UTC so they round-trip without local offset drift.
const TIMESTAMP_OID = 1114;
pg.types.setTypeParser(TIMESTAMP_OID, (value) => new Date(`${value}Z`));
pg.defaults.parseInputDatesAsUTC = true;

export type BattleStatus = "open" | "closed";

export type Battle = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: BattleStatus;
  startsAt: Date | null;
  endsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  hiddenFromHistory: boolean;
};

export type Submission = {
  id: string;
  userId: string;
  username: string | null;
  battleId: string;
  fileKey: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  placement: number | null;
  createdAt: Date;
};

export type Vote = {
  id: string;
  userId: string;
  battleId: string;
  submissionId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type SubmissionWithVotes = Submission & { votes: Vote[] };

const globalForDb = globalThis as unknown as {
  pool?: Pool;
};

// Pin the session time zone so NOW()/CURRENT_TIMESTAMP also produce UTC.
export const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL!,
    options: "-c timezone=UTC",
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

export async function transaction<T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export function newId() {
  return crypto.randomUUID();
}

// Loads submissions (with their votes) for the given battles, keyed by battle id.
export async function getSubmissionsWithVotes(
  battleIds: string[],
  order: "asc" | "desc" = "asc",
): Promise<Map<string, SubmissionWithVotes[]>> {
  const byBattle = new Map<string, SubmissionWithVotes[]>(
    battleIds.map((id) => [id, []]),
  );

  if (battleIds.length === 0) {
    return byBattle;
  }

  const [submissions, votes] = await Promise.all([
    query<Submission>(
      `SELECT * FROM "Submission" WHERE "battleId" = ANY($1)
       ORDER BY "createdAt" ${order === "asc" ? "ASC" : "DESC"}`,
      [battleIds],
    ),
    query<Vote>(`SELECT * FROM "Vote" WHERE "battleId" = ANY($1)`, [
      battleIds,
    ]),
  ]);

  const votesBySubmission = new Map<string, Vote[]>();
  for (const vote of votes) {
    const list = votesBySubmission.get(vote.submissionId) ?? [];
    list.push(vote);
    votesBySubmission.set(vote.submissionId, list);
  }

  for (const submission of submissions) {
    byBattle.get(submission.battleId)?.push({
      ...submission,
      votes: votesBySubmission.get(submission.id) ?? [],
    });
  }

  return byBattle;
}
