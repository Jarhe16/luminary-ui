export default function ContactPage() {
  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      <section style={{ padding: '6rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Contact
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Let&apos;s talk compliance.
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Whether you&apos;re an independent RIA exploring your options, a bank evaluating enterprise compliance tooling, or an existing customer with a question — we&apos;re here.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { label: 'General Inquiries', value: 'hello@luminaryfinancial.co' },
                { label: 'Enterprise & Bank Sales', value: 'hello@luminaryfinancial.co' },
                { label: 'Support', value: 'hello@luminaryfinancial.co' },
                { label: 'Headquarters', value: 'Atlanta, GA' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--foreground)' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '3rem', background: 'var(--surface)', border: '1px solid var(--border)',
              borderLeft: '3px solid var(--accent)', borderRadius: '8px', padding: '1.25rem 1.5rem',
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                For Banks & Institutions
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                If you represent a bank, trust department, or financial institution with complex compliance needs, reach out directly. We build custom enterprise arrangements including bank-specific rulesets, API access, and dedicated onboarding.
              </p>
            </div>
          </div>

          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '2.5rem',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Send us a message</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '2rem' }}>
              We respond to all inquiries within one business day.
            </p>

            <form action={`mailto:hello@luminaryfinancial.co`} method="get" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text" name="name" required placeholder="Jane Smith"
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '6px', color: 'var(--foreground)', fontSize: '0.9rem',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Email
                </label>
                <input
                  type="email" name="email" required placeholder="jane@yourfirm.com"
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '6px', color: 'var(--foreground)', fontSize: '0.9rem',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Firm / Institution
                </label>
                <input
                  type="text" name="firm" placeholder="ABC Advisers LLC"
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '6px', color: 'var(--foreground)', fontSize: '0.9rem',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Inquiry Type
                </label>
                <select
                  name="type"
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '6px', color: 'var(--foreground)', fontSize: '0.9rem',
                    outline: 'none', cursor: 'pointer', boxSizing: 'border-box',
                  }}
                >
                  <option>General Inquiry</option>
                  <option>Enterprise / Bank Sales</option>
                  <option>Pricing Question</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                  Message
                </label>
                <textarea
                  name="body" required rows={5} placeholder="Tell us about your firm and what you need..."
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    borderRadius: '6px', color: 'var(--foreground)', fontSize: '0.9rem',
                    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '12px', background: 'var(--accent)', color: '#0d0f1a',
                  border: 'none', borderRadius: '6px', fontWeight: 800,
                  fontSize: '0.9rem', cursor: 'pointer',
                }}
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

    </main>
  );
}
