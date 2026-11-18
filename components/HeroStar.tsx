// Decorative star with a light beam for the homepage hero (brand signature).
// Pure SVG + CSS animation; hidden from assistive tech; respects reduced motion.
// Glints scattered along the beam: [left %, top %, size px, delay s, duration s, desktopOnly]
const SPARKLES: [number, number, number, number, number, boolean][] = [
  [80, 15.6, 9, 0.0, 3.4, false],
  [73, 14.2, 7, 1.6, 2.8, false],
  [66, 13.6, 8, 0.8, 3.9, false],
  [58, 12.4, 6, 2.4, 3.1, true],
  [51, 11.3, 8, 0.4, 3.6, false],
  [44, 10.6, 6, 2.0, 2.7, true],
  [37, 9.9, 7, 1.2, 4.2, false],
  [29, 9.0, 5, 2.8, 3.0, true],
  [21, 8.3, 6, 0.6, 3.5, true],
  [70, 20.6, 6, 1.9, 3.3, true],
  [55, 21.8, 7, 0.2, 3.8, false],
  [39, 23.1, 5, 2.6, 2.9, true],
  [24, 24.2, 6, 1.4, 4.0, true],
];

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
      {SPARKLES.map(([left, top, size, delay, dur, desktopOnly], i) => (
        <span
          key={i}
          className={desktopOnly ? 'hero-sparkle hero-sparkle-desktop' : 'hero-sparkle'}
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
