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

  // Record when each user accepted the Terms of Service and Privacy Policy
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMPTZ`;

  // One-time password reset links (only a SHA-256 hash of the token is stored)
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash  TEXT    NOT NULL UNIQUE,
      expires_at  TIMESTAMPTZ NOT NULL,
      used_at     TIMESTAMPTZ,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
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

  // Prepaid audit credits (single reports and extra audits bought outside the monthly allowance)
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS audit_credits INTEGER NOT NULL DEFAULT 0`;

  // One row per paid one-time Checkout session, so a credit purchase is never applied twice
  await sql`
    CREATE TABLE IF NOT EXISTS credit_purchases (
      id                SERIAL PRIMARY KEY,
      stripe_session_id TEXT    NOT NULL UNIQUE,
      user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind              TEXT    NOT NULL,
      credits           INTEGER NOT NULL,
      amount_cents      INTEGER,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Lock Supabase's public REST API out of every table (Row Level Security, no policies).
  // The app connects directly as the table owner, which bypasses RLS, so it is unaffected.
  await sql`ALTER TABLE users                 ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE audit_runs            ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY`;
  await sql`ALTER TABLE credit_purchases      ENABLE ROW LEVEL SECURITY`;
}
