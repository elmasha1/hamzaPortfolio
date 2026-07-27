import { createPortal } from 'react-dom'

/**
 * GridOverlay — reveals the 12-column layout grid the site is authored on.
 *
 * A signature detail for the audience that will look for it, costing one
 * boolean. Rendered through a portal so no transformed ancestor can trap the
 * fixed positioning, and pointer-events-none so it never intercepts a click.
 */
export default function GridOverlay({ visible }) {
  if (!visible || typeof document === 'undefined') return null

  return createPortal(
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[55]">
      <div className="container-px h-full">
        <div className="grid h-full grid-cols-12 gap-6">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="h-full bg-white/[0.035]" />
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}
