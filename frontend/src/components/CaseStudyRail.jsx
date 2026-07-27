import { useEffect, useState } from 'react'
import Meta from './ui/Meta'

/**
 * CaseStudyRail — the sticky mono index beside a case study (lg and up).
 *
 * Lists only the blocks the dashboard actually filled in, and highlights the
 * one you are reading. Decoration for screen readers (the blocks carry their
 * own headings), so the whole rail is aria-hidden.
 */
export default function CaseStudyRail({ blocks }) {
  const [active, setActive] = useState(blocks[0]?.id)

  useEffect(() => {
    if (blocks.length === 0) return
    const nodes = blocks
      .map((b) => document.getElementById(b.id))
      .filter(Boolean)
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      // A band across the upper third: whichever block sits in it is "current".
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [blocks])

  if (blocks.length === 0) return null

  return (
    <nav aria-hidden="true" className="sticky top-28 hidden lg:block">
      <ul className="space-y-3 border-l border-rule-soft pl-5">
        {blocks.map((b) => {
          const current = b.id === active
          return (
            <li key={b.id} className="relative">
              {current && (
                <span className="absolute -left-5 top-1/2 h-3 w-px -translate-y-1/2 bg-ink-100" />
              )}
              <a
                href={`#${b.id}`}
                className={`block font-mono text-eyebrow font-medium uppercase tracking-[0.06em] transition-colors duration-300 ${
                  current ? 'text-ink-100' : 'text-ink-700 hover:text-ink-500'
                }`}
              >
                {b.number} — {b.label}
              </a>
            </li>
          )
        })}
      </ul>
      <Meta className="mt-6 block border-t border-rule-soft pt-4 text-ink-700">
        {blocks.length} sections
      </Meta>
    </nav>
  )
}
