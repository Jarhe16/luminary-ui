import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'This reset link is invalid.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const rows = await sql`
      SELECT id, user_id FROM password_reset_tokens
      WHERE token_hash = ${tokenHash} AND used_at IS NULL AND expires_at > NOW()
    `;
    const row = rows[0] as { id: number; user_id: number } | undefined;
    if (!row) {
      return NextResponse.json(
        { error: 'This reset link has expired or was already used. Please request a new one.' },
        { status: 400 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    await sql`UPDATE users SET password = ${hashed} WHERE id = ${row.user_id}`;
    // Mark this token used and invalidate any other outstanding links for the account
    await sql`UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ${row.user_id} AND used_at IS NULL`;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
