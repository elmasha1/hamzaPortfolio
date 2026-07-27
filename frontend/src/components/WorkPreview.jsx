import { m } from 'framer-motion'
import { DUR, EASE } from '../lib/motion'
import Meta from './ui/Meta'

/* Deliberately unfinished-looking: a mono plate, not a fake screenshot. */
function NoPreview({ title }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-paper-2"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 1px, transparent 1px 10px)',
      }}
    >
      <div className="px-6 text-center">
        <Meta caps className="block tracking-[0.08em]">
          No preview
        </Meta>
        <Meta className="mt-2 block text-ink-700">{title}</Meta>
      </div>
    </div>
  )
}

/**
 * WorkPreview — the sticky panel beside the work index (lg and up).
 *
 * Colour is the reward: every project rests in grayscale and only the active
 * one — the row being hovered OR keyboard-focused — goes to full colour. All
 * frames stay mounted and crossfade, so switching never flashes a blank panel.
 * Under reduced motion the swap is instant.
 */
export default function WorkPreview({ projects, active, meta, reduce }) {
  if (!projects.length) return null

  return (
    <div className="sticky top-28">
      <div className="relative aspect-[5/4] w-full overflow-hidden border border-rule-soft bg-paper-2">
        {projects.map((p, i) => {
          const isActive = i === active
          return (
            <m.div
              key={p.id ?? i}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : DUR.micro, ease: EASE.out }}
              className="absolute inset-0"
              aria-hidden={!isActive}
            >
              {p.image ? (
                <img
                  src={p.image}
                  alt={`${p.title} — preview`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  width="1000"
                  height="800"
                  className={`h-full w-full object-cover transition-[filter] duration-300 ${
                    isActive ? 'grayscale-0' : 'grayscale'
                  }`}
                />
              ) : (
                <NoPreview title={p.title} />
              )}
            </m.div>
          )
        })}
      </div>

      <div className="mt-3.5 flex items-baseline justify-between gap-4">
        <Meta caps tone="body" className="tracking-[0.05em]">
          {meta}
        </Meta>
        <Meta caps className="tracking-[0.05em]">
          {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </Meta>
      </div>
    </div>
  )
}
