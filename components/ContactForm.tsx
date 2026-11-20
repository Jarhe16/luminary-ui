'use client';

// Contact form: posts to /api/contact, which emails the right Luminary inbox and
// sends the visitor an acknowledgement.

import { useState } from 'react';
import { INQUIRY_TYPES } from '@/lib/contact';
import { COMPANY } from '@/lib/company';

const labelStyle = {
  display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)',
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px',
} as const;
const fieldStyle = {
  width: '100%', padding: '10px 12px',
  background: 'var(--surface-2)', border: '1px solid var(--border)',
  borderRadius: '6px', color: 'var(--foreground)', fontSize: '0.9rem',
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
} as const;

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : `Something went wrong. Please email us at ${COMPANY.email}.`);
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" style={{ padding: '1.5rem 0' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Thank you — your message was sent.</div>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          We&apos;ll reply within one business day. A confirmation is on its way to your inbox.
        </p>
        <button
          type="button" onClick={() => setStatus('idle')}
          style={{ marginTop: '1.25rem', background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--foreground)', padding: '8px 16px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Spam trap: hidden from people, often filled by bots */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>Website <input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div>
        <label htmlFor="cf-name" style={labelStyle}>Full Name</label>
        <input id="cf-name" type="text" name="name" required maxLength={120} placeholder="Jane Smith" style={fieldStyle} />
      </div>
      <div>
        <label htmlFor="cf-email" style={labelStyle}>Email</label>
        <input id="cf-email" type="email" name="email" required maxLength={200} placeholder="jane@yourfirm.com" style={fieldStyle} />
      </div>
      <div>
        <label htmlFor="cf-firm" style={labelStyle}>Firm / Institution</label>
        <input id="cf-firm" type="text" name="firm" maxLength={160} placeholder="ABC Advisers LLC" style={fieldStyle} />
      </div>
      <div>
        <label htmlFor="cf-type" style={labelStyle}>Inquiry Type</label>
        <select id="cf-type" name="type" defaultValue="General Inquiry" style={{ ...fieldStyle, cursor: 'pointer' }}>
          {INQUIRY_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="cf-message" style={labelStyle}>Message</label>
        <textarea
          id="cf-message" name="message" required rows={5} maxLength={5000}
          placeholder="Tell us about your firm and what you need..."
          style={{ ...fieldStyle, resize: 'vertical' }}
        />
      </div>
      {status === 'error' && (
        <div role="alert" style={{ fontSize: '0.85rem', color: '#f87171' }}>{error}</div>
      )}
      <button
        type="submit" disabled={status === 'sending'}
        style={{
          padding: '12px', background: 'var(--accent)', color: '#0d0f1a',
          border: 'none', borderRadius: '6px', fontWeight: 800,
          fontSize: '0.9rem', cursor: status === 'sending' ? 'wait' : 'pointer',
          opacity: status === 'sending' ? 0.7 : 1,
        }}
      >
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
