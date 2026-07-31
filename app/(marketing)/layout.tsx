import Link from 'next/link';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: '1px solid var(--border)',
        background: 'rgba(13,15,26,0.92)',
        backdropFilter: 'blur(12px)',
        padding: '0 2rem',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.08em' }}>
              LUMINARY FINANCIAL
            </div>
            <div style={{ fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: '-2px' }}>
              Compliance Intelligence Platform
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/how-it-works" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
            How It Works
          </Link>
          <Link href="/plans" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
            Pricing
          </Link>
          <Link href="/about" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
            About
          </Link>
          <Link href="/contact" style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 }}>
            Contact
          </Link>
          <Link href="/auth/login" style={{
            fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none',
            border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 16px',
          }}>
            Sign In
          </Link>
          <Link href="/auth/register" style={{
            fontSize: '0.85rem', fontWeight: 700, color: '#0d0f1a', textDecoration: 'none',
            background: 'var(--accent)', borderRadius: '6px', padding: '6px 18px',
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      <div style={{ paddingTop: '64px' }}>
        {children}
      </div>

      <footer style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '4rem 2rem 2rem',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
                LUMINARY FINANCIAL
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Compliance Intelligence Platform
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6, maxWidth: '280px' }}>
                AI-powered compliance auditing for Registered Investment Advisers and financial institutions. Built on the ICM methodology.
              </p>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                A <span style={{ color: 'var(--foreground)' }}>Luminary Financial</span> product<br />
                DBA under Apex Vital Holdings LLC
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Platform</div>
              {[['How It Works', '/how-it-works'], ['Plans', '/plans'], ['Get Started', '/auth/register'], ['Sign In', '/auth/login']].map(([label, href]) => (
                <div key={href} style={{ marginBottom: '0.6rem' }}>
                  <Link href={href} style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none' }}>{label}</Link>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Company</div>
              {[['About', '/about'], ['Contact', '/contact']].map(([label, href]) => (
                <div key={href} style={{ marginBottom: '0.6rem' }}>
                  <Link href={href} style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none' }}>{label}</Link>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Legal</div>
              {[['Terms of Service', '/terms'], ['Privacy Policy', '/privacy']].map(([label, href]) => (
                <div key={href} style={{ marginBottom: '0.6rem' }}>
                  <Link href={href} style={{ fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none' }}>{label}</Link>
                </div>
              ))}
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                hello@luminaryfinancial.co
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              © {new Date().getFullYear()} Apex Vital Holdings LLC. All rights reserved. Luminary Financial is a DBA.
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              NAICS 522310 · Atlanta, GA
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
