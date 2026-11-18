// Decorative star with a light beam for the homepage hero (brand signature).
// Pure SVG + CSS animation; hidden from assistive tech; respects reduced motion.
// A few larger glints near the star: [left %, top %, size px, delay s, duration s]
const GLINTS: [number, number, number, number, number][] = [
  [79, 15.5, 8, 0.0, 3.6],
  [64, 13.3, 6, 1.7, 4.2],
  [47, 11.0, 6, 0.9, 3.8],
  [58, 21.4, 5, 2.5, 4.4],
];

// Fine stardust inside the two beams. Deterministic so server and browser match.
type Dust = { left: number; top: number; size: number; delay: number; dur: number; peak: number; mobile: boolean };
function makeDust(): Dust[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const out: Dust[] = [];
  for (let i = 0; i < 70; i++) {
    const soft = i % 3 === 2; // a third of the dust sits in the softer lower beam
    const x = 86 - 84 * Math.pow(rand(), 1.5); // denser near the star
    const t = x / 88;
    const top = soft ? 20 - 3 * t : 1 + 16 * t;
    const bottom = soft ? 30 - 13 * t : 13 + 4 * t;
    const y = top + (bottom - top) * (0.2 + 0.6 * rand());
    const near = t; // 0 far left .. 1 at the star
    out.push({
      left: +x.toFixed(2),
      top: +y.toFixed(2),
      size: +(1 + rand() * 1.8 + near * 0.6).toFixed(2),
      delay: +(rand() * 5).toFixed(2),
      dur: +(2.6 + rand() * 3).toFixed(2),
      peak: +((soft ? 0.45 : 0.6) * (0.5 + 0.5 * near) + 0.2).toFixed(2),
      mobile: i % 2 === 0,
    });
  }
  return out;
}
const DUST = makeDust();

export default function HeroStar() {
  return (
    <div className="hero-star-layer" aria-hidden="true">
      <svg className="hero-beam" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="heroBeamGrad" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="#E6C873" stopOpacity="0.45" />
            <stop offset="0.55" stopColor="#C9A84C" stopOpacity="0.12" />
            <stop offset="1" stopColor="#C9A84C" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="88,17 0,1 0,13" fill="url(#heroBeamGrad)" />
        <polygon className="hero-beam-soft" points="88,17 0,20 0,30" fill="url(#heroBeamGrad)" />
      </svg>
      {DUST.map((d, i) => (
        <span
          key={`d${i}`}
          className={d.mobile ? 'hero-dust' : 'hero-dust hero-dust-desktop'}
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.dur}s`,
            ['--peak' as string]: d.peak,
          } as React.CSSProperties}
        />
      ))}
      {GLINTS.map(([left, top, size, delay, dur], i) => (
        <span
          key={`g${i}`}
          className="hero-sparkle"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: size,
            height: size,
            animationDelay: `${delay}s`,
            animationDuration: `${dur}s`,
          }}
        />
      ))}
      <div className="hero-star">
        <svg viewBox="0 0 120 120" width="100%" height="100%">
          <defs>
            <radialGradient id="heroStarGlow">
              <stop offset="0" stopColor="#F1D88E" stopOpacity="0.55" />
              <stop offset="1" stopColor="#F1D88E" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="hero-star-glow" cx="60" cy="60" r="58" fill="url(#heroStarGlow)" />
          <path
            className="hero-star-shape"
            d="M60 24 L67 53 L96 60 L67 67 L60 96 L53 67 L24 60 L53 53 Z"
            fill="#E6C873"
          />
        </svg>
      </div>
    </div>
  );
}
