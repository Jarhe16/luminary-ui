// Decorative star with a light beam for the homepage hero (brand signature).
// Pure SVG + CSS animation; hidden from assistive tech; respects reduced motion.
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
