import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import sql from '@/lib/db';
import { TIER_LABELS } from '@/lib/tiers';

// GET /api/admin/users — list all users with audit stats
export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const users = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.tier,
      u.created_at,
      COUNT(r.id)                                           AS total_audits,
      SUM(CASE WHEN r.high_count > 0 THEN 1 ELSE 0 END)   AS high_audits,
      MAX(r.created_at)                                     AS last_audit
    FROM users u
    LEFT JOIN audit_runs r ON r.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `;

  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const statsRows = await sql`
    SELECT
      (SELECT COUNT(*) FROM users)                                               AS total_users,
      (SELECT COUNT(*) FROM audit_runs)                                          AS total_audits,
      (SELECT COUNT(*) FROM audit_runs WHERE created_at >= ${monthStart})        AS audits_this_month,
      (SELECT SUM(high_count) FROM audit_runs WHERE created_at >= ${monthStart}) AS high_findings_this_month
  `;
  const stats = statsRows[0];

  return NextResponse.json({ users, stats });
}

// PATCH /api/admin/users — update tier or role for a user
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const { userId, tier, role } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId required.' }, { status: 400 });
  }

  const validTiers = Object.keys(TIER_LABELS);
  const validRoles = ['user', 'admin'];

  if (tier && !validTiers.includes(tier)) {
    return NextResponse.json({ error: 'Invalid tier.' }, { status: 400 });
  }
  if (role && !validRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
  }

  if (tier) {
    await sql`UPDATE users SET tier = ${tier} WHERE id = ${userId}`;
  }
  if (role) {
    await sql`UPDATE users SET role = ${role} WHERE id = ${userId}`;
  }

  return NextResponse.json({ success: true });
}
