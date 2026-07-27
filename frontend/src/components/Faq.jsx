import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce, DUR, EASE } from '../lib/motion'
import Meta from './ui/Meta'

/* One question. The toggle is a +/− glyph, not a chevron — it reads as a spec
   sheet rather than a marketing accordion. */
function Row({ item, index, open, onToggle }) {
  const panelId = `faq-panel-${index}`
  const buttonId = `faq-button-${index}`

  return (
    <m.div variants={fadeUp(16)} className="border-b border-rule-soft">
      <h3>
        <button
          type="button"
          id={buttonId}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-5 py-5 text-left"
        >
          <span className="flex items-baseline gap-4">
            <Meta aria-hidden="true">{String(index + 1).padStart(2, '0')}</Meta>
            <span
              className={`text-[1.1875rem] font-medium leading-[1.3] transition-colors duration-300 ${
                open ? 'text-ink-100' : 'text-ink-300 group-hover:text-ink-100'
              }`}
            >
              {item.q}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 font-mono text-sm text-ink-500 transition-colors duration-300 group-hover:text-ink-100"
          >
            {open ? '−' : '+'}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
            className="overflow-hidden"
          >
            <p className="max-w-[60ch] pb-5 pl-[2.625rem] text-small text-ink-300">{item.a}</p>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  )
}

/**
 * Faq — "Before you write".
 *
 * Extracted from the pricing page and mounted under the contact form, where
 * the objections it answers actually occur. One open at a time; the first row
 * starts open so the pattern is discoverable.
 *
 * Dashboard-driven via `pricing.faq` — self-hides when empty.
 */
export default function Faq({ items = [], title = 'Before you write' }) {
  const rows = Array.isArray(items) ? items.filter((f) => f && f.q) : []
  const [open, setOpen] = useState(0)

  if (rows.length === 0) return null

  return (
    <m.div
      variants={staggerContainer(0.06)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="mt-14 border-t border-rule pt-5 sm:mt-16"
    >
      <Meta caps className="mb-2 block">
        {title}
      </Meta>
      {rows.map((item, i) => (
        <Row
          key={i}
          item={item}
          index={i}
          open={open === i}
          onToggle={() => setOpen(open === i ? -1 : i)}
        />
      ))}
    </m.div>
  )
}
