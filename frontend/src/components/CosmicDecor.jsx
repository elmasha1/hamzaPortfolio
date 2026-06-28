/**
 * CosmicDecor — fixed, behind-content decorative layer for the deep-space
 * theme: a large glowing arc on the right edge (blue gradient stroke, partly
 * off-screen, soft glow) and a fainter diagonal arc on the left. Both breathe
 * very slowly and are kept subtle so they never compete with content.
 *
 * The page's radial background gradient + vignette live on `body` (index.css);
 * this only adds the arcs and a touch of extra glow.
 */
export default function CosmicDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Small, soft central glow behind the headline with a fast falloff to
          near-black — most of the screen reads very dark. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 42% at 50% 14%, rgba(14,30,60,0.85) 0%, rgba(8,18,38,0.45) 24%, rgba(2,6,15,0) 50%)',
        }}
      />
      {/* Strong vignette: corners + lower area clearly darker (enclosed feel) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(125% 115% at 50% 26%, rgba(2,6,15,0) 30%, rgba(1,3,10,0.72) 66%, rgba(0,1,6,0.97) 100%)',
        }}
      />

      {/* Right-edge glowing arc — large, thin, partially off-screen */}
      <svg
        className="absolute top-1/2 h-[160vh] w-[160vh] -translate-y-1/2 motion-safe:animate-breathe"
        style={{
          right: '-46vh',
          opacity: 0.6,
          filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.22))',
        }}
        viewBox="0 0 800 800"
        fill="none"
      >
        <defs>
          <linearGradient id="arc-right" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="48%" stopColor="#3B82F6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="400" cy="400" r="362" stroke="url(#arc-right)" strokeWidth="1.5" />
      </svg>

      {/* Left faint diagonal arc — much lower opacity */}
      <svg
        className="absolute h-[130vh] w-[130vh] motion-safe:animate-breathe"
        style={{ left: '-58vh', top: '-8vh', opacity: 0.12, animationDelay: '-4s' }}
        viewBox="0 0 800 800"
        fill="none"
      >
        <defs>
          <linearGradient id="arc-left" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#5B8DD6" stopOpacity="0" />
            <stop offset="55%" stopColor="#5B8DD6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#5B8DD6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="400" cy="400" r="384" stroke="url(#arc-left)" strokeWidth="1" />
      </svg>
    </div>
  )
}
