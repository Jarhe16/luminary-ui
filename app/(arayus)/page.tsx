import Link from 'next/link';
import s from './arayus.module.css';

// Arayus homepage (preview). Replaces the Luminary homepage at "/" on this branch only.
// The rest of the marketing site still uses the Luminary layout until the name is cleared.

const NAV = [
  { href: '/how-it-works', label: 'HOW IT WORKS' },
  { href: '/plans', label: 'PRICING' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

const AUDIENCES = [
  {
    tag: 'RIAs',
    title: 'Registered investment advisers',
    text: 'A first pass on your Form ADV Part 2A before each annual update, so fee, conflict and custody language stays consistent.',
  },
  {
    tag: 'BANKS & TRUST',
    title: 'Bank trust departments and trust companies',
    text: 'A faster first read of fund prospectuses and offering documents, with every finding tied to the exact language.',
  },
  {
    tag: 'CONSULTANTS',
    title: 'Compliance consultants and outsourced CCOs',
    text: "One consistent first pass across every client firm's documents, so your time goes to the findings that need an expert.",
  },
];

// Small four-point stars along the ray: [x, y, size, opacity]
const SPARKS: [number, number, number, number][] = [
  [960, 170, 9, 0.95], [820, 150, 7, 0.85], [690, 190, 6, 0.8], [560, 135, 6, 0.7],
  [430, 180, 5, 0.6], [300, 120, 5, 0.5], [880, 330, 5, 0.6], [640, 355, 4, 0.5],
];

// Tiny dots of light along the ray: [x, y, r, opacity]
const DOTS: [number, number, number, number][] = [
  [510, 172, 2.1, 0.53], [232, 322, 1.7, 0.4], [865, 161, 1.2, 0.69], [134, 197, 1.8, 0.36],
  [84, 384, 2.2, 0.34], [720, 176, 1, 0.62], [580, 177, 1.5, 0.56], [729, 238, 1.2, 0.63],
  [1078, 177, 2, 0.78], [776, 165, 1.1, 0.65], [341, 279, 1.9, 0.45], [456, 193, 1.3, 0.51],
  [1036, 178, 0.8, 0.77], [258, 344, 1.5, 0.42], [695, 183, 1.2, 0.61], [131, 326, 2.1, 0.36],
  [828, 160, 1.1, 0.67], [145, 115, 1.9, 0.37], [709, 153, 1.4, 0.62], [876, 168, 2, 0.69],
  [259, 154, 2, 0.42], [382, 149, 0.9, 0.47], [665, 164, 1.4, 0.6], [941, 200, 1, 0.72],
  [985, 179, 1.1, 0.74], [237, 188, 2.1, 0.41], [244, 349, 2, 0.41],
];

function spark(x: number, y: number, r: number) {
  const k = r * 0.25;
  return `M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k} Z`;
}

const twinkleClass = (i: number) =>
  [s.twinkle, i % 2 === 1 ? s.twinkleB : '', i % 3 === 2 ? s.twinkleC : ''].filter(Boolean).join(' ');

function Logo() {
  return (
    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 260 260">
      <path d="M48 222 L118 46 L188 222" fill="none" stroke="#c9a84c" strokeWidth="22" strokeLinecap="square" />
      <path d="M84 160 L152 160" fill="none" stroke="#c9a84c" strokeWidth="12" />
      <path d="M196 38 L204 70 L236 78 L204 86 L196 118 L188 86 L156 78 L188 70 Z" fill="#E6C873" />
    </svg>
  );
}

export default function ArayusHomePage() {
  return (
    <main className={s.page}>
      <div className={s.hero}>
        <svg className={s.rays} aria-hidden="true" viewBox="0 0 1280 720" preserveAspectRatio="xMaxYMin slice">
          <defs>
            <linearGradient id="heroRay" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#E6C873" stopOpacity="0.42" />
              <stop offset="0.55" stopColor="#C9A84C" stopOpacity="0.1" />
              <stop offset="1" stopColor="#C9A84C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="1112,176 0,72 0,250" fill="url(#heroRay)" />
          <polygon points="1112,176 0,300 0,420" fill="url(#heroRay)" opacity="0.55" />
          {SPARKS.map(([x, y, r, o], i) => (
            <path key={`s${i}`} className={twinkleClass(i)} d={spark(x, y, r)} fill="#F3DD95" opacity={o} />
          ))}
          {DOTS.map(([x, y, r, o], i) => (
            <circle key={`d${i}`} className={twinkleClass(i + 1)} cx={x} cy={y} r={r} fill="#F3DD95" opacity={o} />
          ))}
          <path
            className={s.mainStar}
            d="M1112 128 L1122 166 L1160 176 L1122 186 L1112 224 L1102 186 L1064 176 L1102 166 Z"
            fill="#E6C873"
          />
        </svg>

        <nav aria-label="Main" className={s.nav}>
          <Link href="/" aria-label="Arayus home" className={s.brand}>
            <Logo />
            <span className={`${s.serif} ${s.wordmark}`}>
              A<span className={s.ray}>ray</span>us
            </span>
          </Link>
          <div className={s.navLinks}>
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className={s.navText}>{label}</Link>
            ))}
            <Link href="/auth/login">SIGN IN</Link>
            <Link href="/auth/register" className={s.navCta}>GET STARTED</Link>
          </div>
        </nav>

        <div className={s.heroBody}>
          <div className={s.eyebrow}>
            <span aria-hidden="true" className={s.eyebrowRule} />
            <span>AI COMPLIANCE REVIEW FOR RIAs, BANKS &amp; TRUST COMPANIES</span>
          </div>
          <h1 className={`${s.serif} ${s.h1}`}>
            Bring risk <em>to light.</em>
          </h1>
          <p className={s.lede}>
            A clause-level first pass on ADV brochures, fund prospectuses and offering documents in under 60 seconds.
            Every finding shows the rule, the exact language and a severity rating, so your review time goes to judgment.
          </p>
          <div className={s.ctaRow}>
            <Link href="/auth/register" className={s.ctaPrimary}>START FREE 7-DAY TRIAL</Link>
            <Link href="/how-it-works" className={s.ctaSecondary}>SEE HOW IT WORKS</Link>
          </div>
        </div>
      </div>

      <section aria-labelledby="who" className={s.who}>
        <div>
          <div className={s.sectionLabel}>WHO IT&apos;S FOR</div>
          <h2 id="who" className={`${s.serif} ${s.h2}`}>Built for the people who sign off.</h2>
        </div>
        <div className={s.cards}>
          {AUDIENCES.map(a => (
            <div key={a.tag} className={s.card}>
              <div className={s.cardTag}>{a.tag}</div>
              <div className={`${s.serif} ${s.cardTitle}`}>{a.title}</div>
              <p className={s.cardText}>{a.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="start" className={s.closing}>
        <h2 id="start" className={`${s.serif} ${s.h2}`}>See what your next review turns up.</h2>
        <p>Start a free 7-day trial: 3 audits, no credit card required.</p>
        <div className={s.ctaRow}>
          <Link href="/auth/register" className={s.ctaPrimary}>START FREE 7-DAY TRIAL</Link>
          <Link href="/contact" className={s.ctaSecondary}>TALK TO US</Link>
        </div>
      </section>

      <footer className={s.footer}>
        <span>© {new Date().getFullYear()} Arayus is a product of Luminary Financial LLC · Atlanta, Georgia</span>
        <div className={s.footerLinks}>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </footer>
    </main>
  );
}
