'use client';

import { useState } from 'react';
import Link from 'next/link';

export type PlanTier = {
  key: string;
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  color: string;
  highlight: boolean;
  cta: string;
};

type Audience = 'firms' | 'consultants';

export default function PlanTabs({ firmTiers, consultantTiers }: { firmTiers: PlanTier[]; consultantTiers: PlanTier[] }) {
  const [audience, setAudience] = useState<Audience>('firms');
  const tiers = audience === 'firms' ? firmTiers : consultantTiers;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '10px 22px',
    minHeight: '44px',
    borderRadius: '999px',
    border: 'none',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#0d0f1a' : 'var(--muted)',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
  });

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div role="group" aria-label="Choose plan type" style={{ display: 'inline-flex', gap: '4px', padding: '4px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px' }}>
          <button type="button" aria-pressed={audience === 'firms'} onClick={() => setAudience('firms')} style={tabStyle(audience === 'firms')}>
            For firms
          </button>
          <button type="button" aria-pressed={audience === 'consultants'} onClick={() => setAudience('consultants')} style={tabStyle(audience === 'consultants')}>
            For consultants
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {tiers.map(tier => (
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

      {audience === 'consultants' && (
        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.95rem', color: 'var(--muted)' }}>
          Just need one report? <strong style={{ color: 'var(--foreground)' }}>$199 per report</strong>, no subscription.
        </p>
      )}
    </>
  );
}
