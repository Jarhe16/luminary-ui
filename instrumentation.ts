// Next.js instrumentation hook — runs once when the server starts.
// Ensures the database tables exist before any requests are handled.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initDB } = await import('@/lib/db');
    await initDB();
  }
}
