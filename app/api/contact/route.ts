// Contact form submissions. Sends the inquiry to the right Luminary inbox (by inquiry type)
// and an acknowledgement to the visitor. Public route (see lib/auth.config.ts).

import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { COMPANY } from '@/lib/company';
import { INQUIRY_TYPES, type InquiryType } from '@/lib/contact';



function route(type: InquiryType): { to: string; tag: string } {
  switch (type) {
    case 'Institutional / Bank Inquiry':
    case 'Pricing Question':
    case 'Partnership':
      return { to: COMPANY.salesEmail, tag: 'Sales' };
    case 'Customer Support':
      return { to: COMPANY.supportEmail, tag: 'Support' };
    default:
      return { to: COMPANY.email, tag: 'General' };
  }
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

const INSTITUTIONAL_QUESTIONS = [
  'Which document types do you need reviewed (for example prospectuses, Form ADV, offering memoranda, trust or account documents)?',
  'Roughly how many documents per month?',
  'How many people on your team would use Luminary?',
  'Do you have internal (house) policies or limits you would want checked in addition to regulatory rules?',
  'What security or vendor-review requirements will Luminary need to meet (for example a security questionnaire)?',
];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const firm = clean(body.firm, 160);
  const message = clean(body.message, 5000);
  const typeRaw = clean(body.type, 60);
  const type: InquiryType = (INQUIRY_TYPES as readonly string[]).includes(typeRaw)
    ? (typeRaw as InquiryType)
    : 'General Inquiry';

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please fill in your name, a valid email and a message.' }, { status: 400 });
  }

  const { to, tag } = route(type);
  const subject = `[${tag}] ${type} from ${name}${firm ? ` (${firm})` : ''}`;

  const internalText = [
    `Inquiry type: ${type}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Firm: ${firm || '(not given)'}`,
    '',
    message,
    '',
    'Reply to this email to respond directly to the sender.',
  ].join('\n');
  const internalHtml = `
    <p><strong>Inquiry type:</strong> ${esc(type)}<br/>
    <strong>Name:</strong> ${esc(name)}<br/>
    <strong>Email:</strong> ${esc(email)}<br/>
    <strong>Firm:</strong> ${esc(firm || '(not given)')}</p>
    <p style="white-space:pre-wrap">${esc(message)}</p>
    <p style="color:#666;font-size:12px">Reply to this email to respond directly to the sender.</p>`;

  const sent = await sendEmail(to, subject, internalHtml, internalText, { replyTo: email });
  if (!sent) {
    return NextResponse.json(
      { error: `Sorry, your message could not be sent. Please email us at ${COMPANY.email}.` },
      { status: 502 },
    );
  }

  // Acknowledgement to the visitor (best effort; the inquiry is already delivered).
  const institutional = type === 'Institutional / Bank Inquiry';
  const ackReplyTo = to;
  const ackText = [
    `Hi ${name},`,
    '',
    'Thank you for contacting Luminary Financial. We received your message and will reply within one business day.',
    ...(institutional
      ? ['', 'To help us prepare a useful response, feel free to reply with answers to any of these:', ...INSTITUTIONAL_QUESTIONS.map((q, i) => `${i + 1}. ${q}`)]
      : []),
    '',
    'Luminary Financial',
    COMPANY.email,
  ].join('\n');
  const ackHtml = `
    <p>Hi ${esc(name)},</p>
    <p>Thank you for contacting Luminary Financial. We received your message and will reply within one business day.</p>
    ${institutional
      ? `<p>To help us prepare a useful response, feel free to reply with answers to any of these:</p><ol>${INSTITUTIONAL_QUESTIONS.map(q => `<li>${esc(q)}</li>`).join('')}</ol>`
      : ''}
    <p>Luminary Financial<br/>${esc(COMPANY.email)}</p>`;
  await sendEmail(email, 'We received your message — Luminary Financial', ackHtml, ackText, { replyTo: ackReplyTo });

  return NextResponse.json({ ok: true });
}
