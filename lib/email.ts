// Minimal transactional email sender using the Resend REST API (no SDK needed).
// Requires RESEND_API_KEY and EMAIL_FROM (e.g. "Luminary Financial <no-reply@luminaryfinancial.co>").

export async function sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'Luminary Financial <no-reply@luminaryfinancial.co>';

  if (!apiKey) {
    console.error('[email] RESEND_API_KEY is not set; email not sent.');
    return false;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html, text }),
    });
    if (!res.ok) {
      console.error('[email] Resend error', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] send failed', err);
    return false;
  }
}
