import Link from 'next/link';

const STEPS = [
  {
    step: '01',
    title: 'Upload Your Document',
    desc: 'Drag and drop any fund prospectus, ADV Part 2A, PPM, offering memorandum, or disclosure document. Luminary accepts PDF, DOCX, and TXT formats up to any standard document size.',
  },
  {
    step: '02',
    title: 'AI Reads Every Clause',
    desc: 'Our AI engine reads the full document text and cross-references every clause against a comprehensive ruleset of active SEC regulations and RIA compliance mandates — including concentration limits, leverage ratios, fee disclosure requirements, and fiduciary alignment rules.',
  },
  {
    step: '03',
    title: 'Violations Are Flagged',
    desc: 'Every violation is mapped to a specific Rule ID, the exact clause found in your document, a description of the variance, and a severity rating: HIGH, MED, or LOW. No vague summaries — precise, actionable findings your team can act on immediately.',
  },
  {
    step: '04',
    title: 'Export Your Report',
    desc: 'Download a professionally formatted PDF audit report — branded with Luminary Financial — that documents every finding with full citations. Keep it in your compliance file, share it with counsel, or deliver it to clients.',
  },
];

const RULES = [
  { id: 'RIA-01-CONC', title: 'Concentration Limits', desc: 'No single underlying asset exposure may exceed 10% of total portfolio NAV unless explicitly authorized.' },
  { id: 'RIA-02-LEV', title: 'Leverage Ratios', desc: 'Total portfolio leverage ratios must not cross 2:1 relative to net equity assets.' },
  { id: 'RIA-03-FEES', title: 'Fee Disclosure Alignment', desc: 'Fee structures must match baseline Advisory Services Agreement templates. Performance fees lacking high-water mark provisions are flagged.' },
];

export default function HowItWorksPage() {
  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      {/* Hero */}
      <section style={{ padding: '6rem 2rem 4rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            How It Works
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
            From document upload to audit report in under 60 seconds.
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Luminary Financial uses a proprietary AI compliance engine to analyze your documents against a curated set of SEC and RIA rules — delivering precise, citation-backed findings your team can act on immediately.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {STEPS.map((s, i) => (
            <div key={s.step} style={{
              display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem',
              alignItems: 'flex-start', marginBottom: i < STEPS.length - 1 ? '4rem' : 0,
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                border: '2px solid var(--accent)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>{s.step}</span>
              </div>
              <div style={{ paddingTop: '0.75rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, maxWidth: '620px' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Active Compliance Rules
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              What we audit against.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '560px' }}>
              Our compliance ruleset is continuously maintained and expanded. Every rule is mapped to specific SEC regulations and RIA obligations under the Investment Advisers Act.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {RULES.map(r => (
              <div key={r.id} style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderLeft: '4px solid var(--accent)', borderRadius: '8px',
                padding: '1.25rem 1.5rem', display: 'grid',
                gridTemplateColumns: '120px 1fr', gap: '1.5rem', alignItems: 'center',
              }}>
                <div style={{
                  fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700,
                  color: 'var(--accent)', letterSpacing: '0.05em',
                }}>{r.id}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{r.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>{r.desc}</div>
                </div>
              </div>
            ))}
            <div style={{
              background: 'rgba(201,168,76,0.06)', border: '1px dashed rgba(201,168,76,0.3)',
              borderRadius: '8px', padding: '1.25rem 1.5rem', textAlign: 'center',
            }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                Additional rules added continuously · Enterprise clients receive custom ruleset configuration
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
            See it in action.
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Create your account and run your first compliance audit in under two minutes.
          </p>
          <Link href="/auth/register" style={{
            display: 'inline-block', padding: '14px 36px', background: 'var(--accent)',
            color: '#0d0f1a', borderRadius: '8px', fontWeight: 800,
            fontSize: '0.95rem', textDecoration: 'none',
          }}>
            Start Free Trial
          </Link>
        </div>
      </section>

    </main>
  );
}
