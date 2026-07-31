import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
  max: 1,          // serverless: one connection per function invocation
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id                 SERIAL PRIMARY KEY,
      email              TEXT    UNIQUE NOT NULL,
      name               TEXT    NOT NULL,
      password           TEXT    NOT NULL,
      role               TEXT    NOT NULL DEFAULT 'user',
      tier               TEXT    NOT NULL DEFAULT 'foundation',
      stripe_customer_id TEXT,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS audit_runs (
      id            SERIAL PRIMARY KEY,
      user_id       INTEGER NOT NULL REFERENCES users(id),
      filename      TEXT    NOT NULL,
      file_size_kb  REAL    NOT NULL,
      status        TEXT    NOT NULL DEFAULT 'completed',
      finding_count INTEGER NOT NULL DEFAULT 0,
      high_count    INTEGER NOT NULL DEFAULT 0,
      med_count     INTEGER NOT NULL DEFAULT 0,
      low_count     INTEGER NOT NULL DEFAULT 0,
      findings_json TEXT    NOT NULL DEFAULT '[]',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
