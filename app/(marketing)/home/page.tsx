'use client';
import Link from 'next/link';

const STATS = [
  { value: '$97T+', label: 'Assets under RIA management in the US' },
  { value: '$500K+', label: 'Average SEC enforcement action cost' },
  { value: '60s', label: 'Average time to complete a full audit' },
  { value: '3', label: 'Core rule categories audited per document' },
];

const FEATURES = [
  {
    title: 'Instant Document Analysis',
    desc: 'Upload any fund prospectus, ADV Part 2A, PPM, or disclosure document. Our AI reads every clause and cross-references it against active compliance rules in seconds.',
    icon: '⚡',
  },
  {
    title: 'Precise Violation Detection',
    desc: 'Every finding is mapped to a specific rule ID, the exact clause in your document, the variance description, and a severity rating — HIGH, MED, or LOW.',
    icon: '🎯',
  },
  {
    title: 'Audit-Ready Reports',
    desc: 'Export a branded PDF report for every audit. Include findings, clause citations, and severity summaries — ready for your compliance file or client delivery.',
    icon: '📄',
  },
  {
    title: 'Full Audit History',
    desc: 'Every audit is saved to your account. Review past runs, re-export reports, and track compliance patterns across documents over time.',
    icon: '📊',
  },
  {
    title: 'Built for RIAs and Banks',
    desc: 'Designed specifically for Registered Investment Advisers, trust departments, private banking divisions, and any institution with SEC filing obligations.',
    icon: '🏛️',
  },
  {
    title: 'Enterprise-Grade Security',
    desc: 'Documents are processed securely and never stored after analysis. Your clients\' data stays yours. SOC 2-aligned practices from day one.',
    icon: '🔒',
  },
];

const TESTIMONIAL_PLACEHOLDER = {
  quote: 'Luminary caught a fee disclosure gap in our ADV Part 2A that our outside counsel missed. At our firm\'s AUM, that finding alone justified the entire year\'s subscription.',
  author: 'Chief Compliance Officer',
  firm: 'Independent RIA, Southeast US',
};

const USE_CASES = [
  {
    audience: 'Independent RIAs',
    desc: 'Stop paying $500/hour for outside counsel to review documents your AI can audit in 60 seconds. Run every prospectus, fee disclosure, and client agreement through Luminary before it leaves your desk.',
    cta: 'Start with Foundation',
    tier: 'foundation',
  },
  {
    audience: 'Wealth Management Firms',
    desc: 'Scale your compliance review capacity without scaling headcount. Luminary handles the document audit layer so your CCO focuses on judgment calls, not line-by-line review.',
    cta: 'Explore Accelerator',
    tier: 'accelerator',
  },
  {
    audience: 'Banks & Trust Departments',
    desc: 'Your RIA subsidiary, trust department, and private banking division all generate compliance documents. One platform audits all of them. Contact us for enterprise and bank-specific pricing.',
    cta: 'Contact for Enterprise',
    tier: 'enterprise',
  },
];

export default function HomePage() {
  return (
    <main style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      {/* Hero */}
      <section style={{
        minHeight: '88vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '6rem 2rem 4rem',
        position: 'relative', overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }} />
        {/* Radial fade */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 30%, var(--background) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '20px', padding: '4px 16px', marginBottom: '2rem',
            fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
          }}>
            First-of-its-kind AI compliance auditing
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800,
            lineHeight: 1.1, margin: '0 0 1.5rem',
            color: 'var(--foreground)',
          }}>
            Your compliance documents,{' '}
            <span style={{ color: 'var(--accent)' }}>audited in seconds.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--muted)',
            lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 2.5rem',
          }}>
            Luminary Financial uses AI to audit fund prospectuses, ADV disclosures, and offering memoranda against active SEC and RIA compliance rules — flagging violations before regulators do.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{
              padding: '14px 32px', background: 'var(--accent)', color: '#0d0f1a',
              borderRadius: '8px', fontWeight: 800, fontSize: '0.95rem',
              textDecoration: 'none', letterSpacing: '0.02em',
            }}>
              Start Free Trial
            </Link>
            <Link href="/how-it-works" style={{
              padding: '14px 32px', background: 'transparent',
              border: '1px solid var(--border)', color: 'var(--foreground)',
              borderRadius: '8px', fontWeight: 600, fontSize: '0.95rem',
              textDecoration: 'none',
            }}>
              See How It Works
            </Link>
          </div>

          <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
            No credit card required to start · Cancel anytime
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {STATS.map(s => (
            <div key={s.value} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '0.25rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem / Solution */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              The Problem
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>
              Compliance review is slow, expensive, and error-prone.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Outside counsel charges $400–$800/hour for document review',
                'Manual review misses subtle violations that trigger SEC action',
                'Volume spikes overwhelm in-house compliance teams',
                'No consistent audit trail across documents and time periods',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--high)', fontSize: '0.9rem', marginTop: '2px', flexShrink: 0 }}>✕</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              The Solution
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>
              AI that reads every clause so your team doesn&apos;t have to.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Audit any document in under 60 seconds at any hour',
                'Rule-mapped findings with exact clause citations and severity ratings',
                'Consistent review quality regardless of document volume',
                'Full audit history with exportable PDF reports for every run',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--low)', fontSize: '0.9rem', marginTop: '2px', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--surface)', padding: '6rem 2rem', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Platform Capabilities
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
              Everything your compliance team needs.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: 'var(--surface-2)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '1.75rem',
              }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>{f.title}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Who It&apos;s For
            </div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 1rem' }}>
              Built for every firm with compliance obligations.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--muted)', maxWidth: '560px', margin: '0 auto' }}>
              Whether you manage $50M or $50B in assets, Luminary scales to your document volume and compliance complexity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {USE_CASES.map(uc => (
              <div key={uc.audience} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '2rem',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)',
                  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem',
                }}>
                  {uc.audience}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7, flex: 1, marginBottom: '1.5rem' }}>
                  {uc.desc}
                </p>
                <Link
                  href={uc.tier === 'enterprise' ? '/contact' : '/pricing'}
                  style={{
                    display: 'inline-block', padding: '8px 20px',
                    background: uc.tier === 'enterprise' ? 'transparent' : 'var(--accent)',
                    color: uc.tier === 'enterprise' ? 'var(--accent)' : '#0d0f1a',
                    border: `1px solid var(--accent)`,
                    borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem',
                    textDecoration: 'none', textAlign: 'center',
                  }}
                >
                  {uc.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1.5rem', lineHeight: 1 }}>&ldquo;</div>
          <p style={{ fontSize: '1.15rem', color: 'var(--foreground)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '2rem' }}>
            {TESTIMONIAL_PLACEHOLDER.quote}
          </p>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--foreground)' }}>{TESTIMONIAL_PLACEHOLDER.author}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '4px' }}>{TESTIMONIAL_PLACEHOLDER.firm}</div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Ready to stop guessing and start auditing?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Join RIA firms and financial institutions that use Luminary to catch compliance violations before regulators do. Start your free trial today — no credit card required.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" style={{
              padding: '14px 36px', background: 'var(--accent)', color: '#0d0f1a',
              borderRadius: '8px', fontWeight: 800, fontSize: '1rem',
              textDecoration: 'none',
            }}>
              Start Free Trial
            </Link>
            <Link href="/contact" style={{
              padding: '14px 36px', background: 'transparent',
              border: '1px solid var(--border)', color: 'var(--foreground)',
              borderRadius: '8px', fontWeight: 600, fontSize: '1rem',
              textDecoration: 'none',
            }}>
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
