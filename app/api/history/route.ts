import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import sql from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const runs = await sql`
    SELECT id, filename, file_size_kb, finding_count, high_count, med_count, low_count, findings_json, created_at
    FROM audit_runs
    WHERE user_id = ${session.user.id}
    ORDER BY created_at DESC
    LIMIT 50
  `;

  return NextResponse.json({ runs });
}
