// Luminary Financial logo: gold "L" monogram with a four-point light, plus "Luminary" in script
// and "FINANCIAL" in spaced capitals. `mark` shows only the monogram (for tight spaces).

type Props = { size?: 'sm' | 'md'; mark?: boolean };

export default function BrandLogo({ size = 'sm', mark = false }: Props) {
  const s = size === 'md' ? { icon: 52, script: 44, caps: 11 } : { icon: 42, script: 36, caps: 9 };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 260 260" role="img" aria-label="Luminary Financial">
        <path d="M70 40 L70 210 L200 210" fill="none" stroke="var(--accent)" strokeWidth="30" strokeLinecap="square" strokeLinejoin="miter" />
        <path d="M168 52 L176 84 L208 92 L176 100 L168 132 L160 100 L128 92 L160 84 Z" fill="var(--accent)" />
      </svg>
      {!mark && (
        <span aria-hidden="true" style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--font-script), "Brush Script MT", cursive', fontSize: `${s.script}px`, color: 'var(--foreground)', lineHeight: 1 }}>Luminary</span>
          <span style={{ fontSize: `${s.caps}px`, fontWeight: 600, letterSpacing: '0.42em', color: 'var(--accent)', paddingLeft: '2px', marginTop: '1px' }}>FINANCIAL</span>
        </span>
      )}
    </span>
  );
}
