/**
 * GrainOverlay — a fixed, ultra-subtle film-grain/noise texture over the whole
 * page. A classic luxury detail: it breaks up flat dark gradients and adds a
 * tactile, "printed" feel. Pure CSS (inline SVG turbulence), GPU-cheap,
 * pointer-events-none, and sits below the navbar/modals.
 */
const NOISE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
      "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
      "<feColorMatrix type='saturate' values='0'/></filter>" +
      "<rect width='100%' height='100%' filter='url(%23n)'/></svg>"
  )

export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[40] opacity-[0.035] mix-blend-soft-light"
      style={{ backgroundImage: `url("${NOISE}")`, backgroundSize: '160px 160px' }}
    />
  )
}
