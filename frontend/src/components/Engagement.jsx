import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce, DUR, EASE } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import Button from './ui/Button'
import Skeleton from './ui/Skeleton'
import Meta from './ui/Meta'
import { ArrowRight, Download } from './ui/Icons'
import useSectionNav from '../hooks/useSectionNav'
import useCvDownload from '../hooks/useCvDownload'

/**
 * Legacy `tiers` → v2 `rows`. The dashboard can be migrated at leisure: if the
 * new shape hasn't been filled in yet, the old pricing tiers still render as
 * engagement rows rather than the section going blank.
 */
function normalizeRows(pricing) {
  if (Array.isArray(pricing?.rows) && pricing.rows.length) return pricing.rows
  if (!Array.isArray(pricing?.tiers)) return []
  return pricing.tiers.map((t) => ({
    title: t.name,
    best_for: t.description,
    deliverables: Array.isArray(t.features) ? t.features : [],
    price_from: t.price,
    price_note: t.period,
  }))
}

/* The deliverables list — mono, arrow-prefixed, so it scans as a spec rather
   than as marketing checkmarks. */
function Deliverables({ items, timeline }) {
  if (!items.length && !timeline) return null
  return (
    <div>
      {items.length > 0 && (
        <ul className="space-y-1 font-mono text-[0.8125rem] leading-[2] text-ink-300">
          {items.map((d) => (
            <li key={d}>
              <span aria-hidden="true" className="mr-2 text-ink-500">
                →
              </span>
              {d}
            </li>
          ))}
        </ul>
      )}
      {timeline && (
        <Meta caps className="mt-4 block tracking-[0.05em]">
          {timeline}
        </Meta>
      )}
    </div>
  )
}

function Row({ row, index }) {
  const [open, setOpen] = useState(false)
  const cv = useCvDownload()
  const deliverables = Array.isArray(row.deliverables) ? row.deliverables.filter(Boolean) : []
  const panelId = `engagement-panel-${index}`

  return (
    <motion.div
      variants={fadeUp(24)}
      className="row grid grid-cols-[1.5rem_1fr] items-start gap-x-5 gap-y-4 px-2 py-8 lg:grid-cols-[1.5rem_1.15fr_1.35fr_9.5rem] lg:gap-x-8 lg:py-9"
    >
      <Meta className="pt-1.5">{String(index + 1).padStart(2, '0')}</Meta>

      <div>
        <h3 className="font-heading text-[1.875rem] font-medium leading-[1.15] tracking-[-0.02em] text-ink-100">
          {row.title}
        </h3>
        {row.best_for && (
          <p className="mt-2.5 max-w-[34ch] text-small text-ink-300">{row.best_for}</p>
        )}

        {/* Below lg the 4-column grid collapses, so the deliverables expand in
            place instead of stacking a wall of text under every row. */}
        {deliverables.length > 0 && (
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={panelId}
              className="mt-4 inline-flex items-center gap-2 font-mono text-eyebrow font-medium uppercase tracking-[0.06em] text-ink-500 transition-colors hover:text-ink-100"
            >
              What&rsquo;s included
              <span aria-hidden="true">{open ? '−' : '+'}</span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DUR.fast, ease: EASE.out }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    <Deliverables items={deliverables} timeline={row.timeline} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Deliverables column — desktop */}
      <div className="hidden lg:block">
        <Deliverables items={deliverables} timeline={row.timeline} />
      </div>

      {/* Price, or — for the hiring row — the CV. That single asymmetry is what
          stops the section reading as a subscription table. */}
      <div className="col-span-2 lg:col-span-1 lg:text-right">
        {row.price_from ? (
          <>
            <Meta caps tone="ink" className="block font-medium tracking-[0.05em]">
              {row.price_from}
            </Meta>
            {row.price_note && (
              <Meta className="mt-1.5 block whitespace-pre-line">{row.price_note}</Meta>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={cv.download}
            disabled={cv.loading}
            className="inline-flex items-center gap-2 border-b border-rule pb-1 font-mono text-eyebrow font-medium uppercase tracking-[0.06em] text-ink-300 transition-colors hover:border-ink-100 hover:text-ink-100 disabled:opacity-60"
          >
            {cv.loading ? 'Preparing…' : row.cta_label || 'Download CV'}
            <Download size={13} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

/**
 * Engagement — "Ways to work together" (was Pricing).
 *
 * Three hairline rows, no cards, no highlighted tier, no "most popular" badge:
 * that grammar belongs to a SaaS checkout, and on a personal site it prices
 * the person and tells recruiters they are in the wrong place. Price is
 * demoted to a mono "from" figure at the right edge, and the last row carries
 * the CV instead of a price. One CTA for the group.
 *
 * Dashboard-driven via GET /api/pricing (rows, with legacy tiers as fallback).
 */
export default function Engagement({ pricing, error, onRetry, scope = 'Home', index = '05' }) {
  const goToSection = useSectionNav()

  const loading = pricing === null && !error
  const rows = normalizeRows(pricing)

  return (
    <section id="pricing" className="section-y relative">
      <div className="container-px">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionLabel scope={scope} index={index}>
            Ways to work together
          </SectionLabel>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end lg:gap-12">
            <SplitTextReveal
              as="h2"
              text={pricing?.heading || 'Three ways this usually starts.'}
              amount={0.3}
              className="max-w-[20ch] font-heading text-h2 font-semibold text-ink-100"
            />
            {pricing?.subline && (
              <motion.p variants={fadeUp(16)} className="max-w-[46ch] text-ink-300">
                {pricing.subline}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Loading — three row-height skeletons: same rhythm, no layout shift */}
        {loading && (
          <div className="mt-14 space-y-px border-t border-rule pt-px lg:mt-16">
            <Skeleton className="h-[7.5rem] rounded-none" />
            <Skeleton className="h-[7.5rem] rounded-none" />
            <Skeleton className="h-[7.5rem] rounded-none" />
          </div>
        )}

        {/* Error — visible, with a Retry (never a silent infinite spinner) */}
        {error && (
          <div className="mt-14 flex flex-col items-start gap-5 border border-rule p-8 lg:mt-16">
            <p className="text-ink-300">
              Couldn&rsquo;t load the engagement models — the API didn&rsquo;t respond.
            </p>
            <Button variant="secondary" onClick={onRetry}>
              Retry
            </Button>
          </div>
        )}

        {rows.length > 0 && (
          <>
            <motion.div
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="mt-14 border-t border-rule lg:mt-16"
            >
              {rows.map((row, i) => (
                <Row key={row.title || i} row={row} index={i} />
              ))}
            </motion.div>

            <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
              <Button as="a" href="#contact" onClick={(e) => goToSection('#contact', e)}>
                Start a project
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                />
              </Button>
              {pricing?.note && (
                <Meta className="max-w-[52ch] leading-[1.6]">{pricing.note}</Meta>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
