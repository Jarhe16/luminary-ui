'use client';

// Top navigation for the marketing pages. Wide screens show the full row of links;
// narrow screens (phones, small tablets) show the logo, Get Started and a menu button
// that opens the remaining links in a dropdown.

import { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';

const LINKS = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/plans', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const linkStyle = { fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none', fontWeight: 500 } as const;
const signInStyle = {
  fontSize: '0.85rem', color: 'var(--muted)', textDecoration: 'none',
  border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 16px',
} as const;
const getStartedStyle = {
  fontSize: '0.85rem', fontWeight: 700, color: '#0d0f1a', textDecoration: 'none',
  background: 'var(--accent)', borderRadius: '6px', padding: '6px 18px', whiteSpace: 'nowrap',
} as const;

export default function MarketingNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="mnav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(13,15,26,0.92)',
      backdropFilter: 'blur(12px)',
    }}>
      <div className="mnav-bar" style={{
        height: '64px', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>
        <Link href="/" className="mnav-logo" style={{ textDecoration: 'none' }} aria-label="Luminary Financial home">
          <BrandLogo />
        </Link>

        {/* Wide screens */}
        <div className="mnav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} style={linkStyle}>{label}</Link>
          ))}
          <Link href="/auth/login" style={signInStyle}>Sign In</Link>
          <Link href="/auth/register" style={getStartedStyle}>Get Started</Link>
        </div>

        {/* Narrow screens */}
        <div className="mnav-compact" style={{ alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/auth/register" className="mnav-cta" style={getStartedStyle}>Get Started</Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mnav-menu"
            onClick={() => setOpen(o => !o)}
            style={{
              background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px',
              width: '40px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--foreground)', cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open
                ? <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>
                : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div id="mnav-menu" className="mnav-menu" style={{
          borderTop: '1px solid var(--border)', padding: '0.5rem 1.25rem 1.25rem',
          display: 'flex', flexDirection: 'column',
        }}>
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={close} style={{ ...linkStyle, fontSize: '1rem', padding: '0.85rem 0', borderBottom: '1px solid var(--border)' }}>
              {label}
            </Link>
          ))}
          <Link href="/auth/login" onClick={close} style={{ ...signInStyle, fontSize: '1rem', textAlign: 'center', padding: '0.7rem 16px', marginTop: '1rem' }}>
            Sign In
          </Link>
          <Link href="/auth/register" onClick={close} className="mnav-menu-cta" style={{ ...getStartedStyle, fontSize: '1rem', textAlign: 'center', padding: '0.7rem 18px', marginTop: '0.75rem' }}>
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
