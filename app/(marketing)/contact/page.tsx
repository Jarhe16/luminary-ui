import { COMPANY } from '@/lib/company';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      <section style={{ padding: '6rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <div className="rgrid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>

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
                { label: 'General & Sales Inquiries', value: COMPANY.email },
                { label: 'Customer Support', value: COMPANY.supportEmail },
                { label: 'Headquarters', value: `${COMPANY.addressLine1}, ${COMPANY.addressLine2}` },
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
                If you represent a bank, trust department, or financial institution, choose “Institutional / Bank Inquiry” in the form. We’ll follow up in writing with options for your team, including a pilot and custom rule configuration where needed (scoped and quoted separately). API integration is on our roadmap.
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

            <ContactForm />
          </div>

        </div>
      </section>

    </main>
  );
}
