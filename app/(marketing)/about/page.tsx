import Link from 'next/link';

export default function AboutPage() {
  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      {/* Hero */}
      <section style={{ padding: '6rem 2rem 4rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            About
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem' }}>
            Built by financial services professionals, for financial services professionals.
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Luminary Financial was founded on a simple premise: compliance review is too important to be slow, too expensive to be thorough, and too manual to be consistent. We built the platform we wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Our Mission
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.25rem' }}>
              Make institutional-grade compliance accessible to every adviser.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Large financial institutions employ armies of compliance professionals. Independent RIAs and smaller firms don&apos;t have that luxury — but they face the same regulatory obligations.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7 }}>
              Luminary levels the playing field. Our AI compliance engine delivers the same depth of document review that large institutions get from dedicated teams — at a fraction of the cost, in a fraction of the time.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Founded', value: '2024' },
              { label: 'Headquarters', value: 'Atlanta, GA' },
              { label: 'Legal Entity', value: 'Luminary Financial LLC' },
              { label: 'Parent Company', value: 'Apex Vital Holdings LLC' },
              { label: 'Industry', value: 'Compliance Intelligence · Investment Advice' },
              { label: 'Contact', value: 'hello@luminaryfinancial.co' },
            ].map(item => (
              <div key={item.label} style={{
                display: 'grid', gridTemplateColumns: '140px 1fr',
                gap: '1rem', paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingTop: '2px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--foreground)', whiteSpace: 'pre-line' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Principles
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>What we stand for.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              {
                title: 'Precision Over Speed',
                desc: 'Fast is only valuable if it\'s accurate. Every finding we surface is mapped to a specific rule and a specific clause — never a vague summary.',
              },
              {
                title: 'Adviser-First Design',
                desc: 'We built Luminary for compliance officers and advisers, not for IT departments. The product works the way compliance professionals think.',
              },
              {
                title: 'Confidentiality as Default',
                desc: 'Your clients\' documents are private. We process, not store. Your data is never used to train models or shared with any third party.',
              },
              {
                title: 'Continuous Improvement',
                desc: 'SEC regulations evolve. Our ruleset evolves with them. We continuously expand and refine the compliance rules powering every audit.',
              },
              {
                title: 'Honest Limitations',
                desc: 'AI is a powerful first-pass tool. We tell clients exactly what Luminary does and doesn\'t do. It works alongside counsel, not instead of it.',
              },
              {
                title: 'Built for Scale',
                desc: 'Whether you run 5 audits a month or 500, the platform performs consistently. Enterprise and bank clients get the same precision at any volume.',
              },
            ].map(v => (
              <div key={v.title} style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '1.75rem',
              }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent)' }}>{v.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            Ready to work together?
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Start a free trial, or contact us to talk about your firm&apos;s specific compliance needs.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/auth/register" style={{
              padding: '12px 28px', background: 'var(--accent)', color: '#0d0f1a',
              borderRadius: '8px', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none',
            }}>
              Start Free Trial
            </Link>
            <Link href="/contact" style={{
              padding: '12px 28px', background: 'transparent',
              border: '1px solid var(--border)', color: 'var(--foreground)',
              borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
