import Link from 'next/link';

const TIERS = [
  {
    key: 'foundation',
    name: 'Foundation',
    price: '$997',
    period: '/month',
    desc: 'For independent RIAs and small advisory firms getting started with automated compliance review.',
    features: [
      '10 document audits per month',
      'PDF, DOCX, and TXT support',
      'Rule-mapped violation findings',
      'HIGH / MED / LOW severity ratings',
      'Branded PDF export',
      'Full audit history',
      'Email support',
    ],
    color: '#6b7280',
    highlight: false,
    cta: 'Start with Foundation',
  },
  {
    key: 'accelerator',
    name: 'Accelerator',
    price: '$2,500',
    period: '/month',
    desc: 'For growing RIA firms and wealth management practices with higher document volumes and team needs.',
    features: [
      '50 document audits per month',
      'Everything in Foundation',
      'Priority email support',
      'Multi-user access',
      'Bulk audit history export',
      'Compliance trend reporting',
    ],
    color: '#3b82f6',
    highlight: true,
    cta: 'Start with Accelerator',
  },
  {
    key: 'pinnacle',
    name: 'Pinnacle',
    price: '$4,500',
    period: '/month',
    desc: 'For large RIA firms, institutional advisers, and organizations that require unlimited compliance coverage.',
    features: [
      'Unlimited document audits',
      'Everything in Accelerator',
      'Dedicated support contact',
      'Custom rule set configuration',
      'White-labeled PDF reports',
      'SLA guarantees',
    ],
    color: '#c9a84c',
    highlight: false,
    cta: 'Start with Pinnacle',
  },
];

const ENTERPRISE = {
  features: [
    'Custom pricing based on firm size and AUM',
    'Bank-specific regulatory ruleset expansion',
    'Trust department and private banking division support',
    'Multiple RIA subsidiary management',
    'API access for integration with existing compliance systems',
    'Dedicated implementation and onboarding',
    'Custom SLA and security review',
    'Annual contract with volume discounts',
  ],
};

const FAQ = [
  {
    q: 'What types of documents can Luminary audit?',
    a: 'Luminary audits fund prospectuses, ADV Part 2A disclosures, private placement memoranda (PPMs), offering memoranda, client fee agreements, and any other compliance document in PDF, DOCX, or TXT format.',
  },
  {
    q: 'How accurate is the AI auditing?',
    a: 'Luminary flags violations with specific rule citations and clause references. Like any compliance tool, it should be used alongside — not as a replacement for — qualified legal counsel for final filings. It excels at first-pass review and ongoing monitoring.',
  },
  {
    q: 'Can banks and trust departments use Luminary?',
    a: 'Yes. Banks with RIA subsidiaries, trust departments, and private banking divisions with SEC filing obligations can use Luminary. Contact us for enterprise and bank-specific pricing and custom ruleset configuration.',
  },
  {
    q: 'Is my document data secure?',
    a: 'Documents are processed securely and never stored permanently after analysis. Your data is never used for training or shared with third parties. We follow SOC 2-aligned security practices.',
  },
  {
    q: 'Can I cancel at any time?',
    a: 'Yes. All plans are month-to-month and can be cancelled at any time. Annual contracts are also available at a discount — contact us for details.',
  },
];

export default function PricingPage() {
  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      {/* Hero */}
      <section style={{ padding: '6rem 2rem 4rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Pricing
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Simple, transparent pricing.
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.7 }}>
            Choose the plan that fits your firm. All plans include full platform access. No hidden fees. Cancel any time.
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
            {TIERS.map(tier => (
              <div key={tier.key} style={{
                background: 'var(--surface)',
                border: `2px solid ${tier.highlight ? tier.color : 'var(--border)'}`,
                borderRadius: '12px', padding: '2.25rem 2rem',
                position: 'relative',
                display: 'flex', flexDirection: 'column',
              }}>
                {tier.highlight && (
                  <div style={{
                    position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                    background: tier.color, color: '#fff', fontSize: '0.7rem', fontWeight: 700,
                    padding: '3px 16px', borderRadius: '20px', letterSpacing: '0.1em', textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}>
                    Most Popular
                  </div>
                )}

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: tier.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                  {tier.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--foreground)' }}>{tier.price}</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>{tier.period}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{tier.desc}</p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '0.35rem 0', fontSize: '0.875rem', color: '#a0a8c0' }}>
                      <span style={{ color: tier.color, fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                <Link href="/auth/register" style={{
                  display: 'block', textAlign: 'center', padding: '10px',
                  background: tier.highlight ? tier.color : 'var(--surface-2)',
                  color: tier.highlight ? '#fff' : tier.color,
                  border: `1px solid ${tier.color}`,
                  borderRadius: '6px', fontWeight: 700, fontSize: '0.9rem',
                  textDecoration: 'none',
                }}>
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
            All plans include a 14-day money-back guarantee · Annual pricing available at a discount
          </p>
        </div>
      </section>

      {/* Enterprise */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Enterprise & Banks
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
              Built for institutions with complex compliance needs.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Banks, trust departments, private banking divisions, and large RIA firms with multiple subsidiaries require more than an off-the-shelf plan. We build around your institution.
            </p>
            <Link href="/contact" style={{
              display: 'inline-block', padding: '12px 28px', background: 'var(--accent)',
              color: '#0d0f1a', borderRadius: '8px', fontWeight: 800,
              fontSize: '0.9rem', textDecoration: 'none',
            }}>
              Contact Enterprise Sales
            </Link>
          </div>

          <div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {ENTERPRISE.features.map(f => (
                <li key={f} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }}>✓</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.5 }}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>FAQ</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Common questions.</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {FAQ.map(item => (
              <div key={item.q} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.q}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.7 }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
