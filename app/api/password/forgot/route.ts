import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/lib/db';
import { sendEmail } from '@/lib/email';

const TOKEN_TTL_MINUTES = 60;
const MAX_REQUESTS_PER_HOUR = 3;

// Always returns the same response so attackers can't learn which emails have accounts.
const GENERIC = { success: true, message: 'If an account exists for that email, a reset link is on its way.' };

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const rows = await sql`SELECT id, name, email FROM users WHERE LOWER(email) = LOWER(${email.trim()})`;
    const user = rows[0] as { id: number; name: string; email: string } | undefined;
    if (!user) return NextResponse.json(GENERIC);

    // Basic abuse limit: max 3 reset emails per account per hour
    const recent = await sql`
      SELECT COUNT(*) AS count FROM password_reset_tokens
      WHERE user_id = ${user.id} AND created_at > NOW() - INTERVAL '1 hour'
    `;
    if (Number((recent[0] as { count: string | number }).count) >= MAX_REQUESTS_PER_HOUR) return NextResponse.json(GENERIC);

    // Store only a hash of the token; the raw token goes in the email link
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await sql`
      INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
      VALUES (${user.id}, ${tokenHash}, NOW() + (${TOKEN_TTL_MINUTES} * INTERVAL '1 minute'))
    `;

    // Preview builds link back to their own preview URL; production uses the configured site URL.
    // (Never build the link from the request's Host header — that allows reset-link poisoning.)
    const previewHost = process.env.VERCEL_ENV === 'preview'
      ? (process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL)
      : undefined;
    const baseUrl = previewHost
      ? `https://${previewHost}`
      : (process.env.AUTH_URL || 'https://www.luminaryfinancial.co');
    const link = `${baseUrl}/auth/reset-password?token=${token}`;
    const firstName = String(user.name || '').split(' ')[0] || 'there';

    await sendEmail(
      user.email,
      'Reset your Luminary Financial password',
      `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#1f2937">
        <h2 style="color:#0d0f1a">Reset your password</h2>
        <p>Hi ${firstName.replace(/[<>&"]/g, '')},</p>
        <p>We received a request to reset the password for your Luminary Financial account. Click the button below to choose a new one. This link expires in ${TOKEN_TTL_MINUTES} minutes and can only be used once.</p>
        <p style="margin:28px 0"><a href="${link}" style="background:#c9a84c;color:#0d0f1a;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:bold">Reset password</a></p>
        <p style="font-size:13px;color:#6b7280">If you didn't request this, you can ignore this email — your password won't change.</p>
        <p style="font-size:12px;color:#9ca3af">Luminary Financial LLC · Atlanta, GA · hello@luminaryfinancial.co</p>
      </div>`,
      `Hi ${firstName},\n\nReset your Luminary Financial password here (expires in ${TOKEN_TTL_MINUTES} minutes, single use):\n${link}\n\nIf you didn't request this, ignore this email.\n\nLuminary Financial LLC`,
    );

    return NextResponse.json(GENERIC);
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json(GENERIC);
  }
}
