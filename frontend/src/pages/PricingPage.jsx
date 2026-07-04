import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce, EASE, DUR, STAGGER } from '../lib/motion'
import SectionLabel from '../components/ui/SectionLabel'
import SplitTextReveal from '../components/ui/SplitTextReveal'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import { ArrowRight, Check, ChevronDown } from '../components/ui/Icons'
import { fetchPricing } from '../lib/api'

/* A single FAQ row — minimal accordion with smooth height + fade. */
function FaqRow({ item, open, onToggle, index }) {
  return (
    <motion.div variants={fadeUp(20)} className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        data-cursor="hover"
        className="group flex w-full items-baseline justify-between gap-6 py-6 text-left"
      >
        <span className="flex items-baseline gap-5">
          <span className="font-heading text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>
          <span className={`font-heading text-lg font-medium tracking-[-0.01em] transition-colors sm:text-xl ${open ? 'text-heading' : 'text-body group-hover:text-heading'}`}>
            {item.q}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: DUR.micro, ease: EASE.out }}
          className="shrink-0 text-muted transition-colors group-hover:text-heading"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
            className="overflow-hidden"
          >
            <p className="max-w-[60ch] pb-7 pl-10 text-[15px] leading-[1.7] text-body">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* One pricing tier column. */
function Tier({ tier, index }) {
  const features = Array.isArray(tier.features) ? tier.features : []
  const hl = !!tier.highlighted
  return (
    <motion.article
      variants={fadeUp(28)}
      className={`relative flex flex-col p-8 sm:p-10 ${
        hl
          ? 'border border-white/30 bg-white/[0.03] lg:-my-4 lg:py-14'
          : 'border border-line'
      } rounded-[6px] transition-colors duration-300 hover:bg-white/[0.02]`}
    >
      {hl && (
        <span className="absolute -top-3 left-8 rounded-full border border-white/30 bg-ink px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-heading">
          Most popular
        </span>
      )}

      <h3 className="font-heading text-lg font-semibold tracking-[-0.01em] text-heading sm:text-xl">
        {tier.name}
      </h3>
      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-heading text-[clamp(1.9rem,3.5vw,2.75rem)] font-semibold leading-none tracking-[-0.03em] text-heading">
          {tier.price}
        </span>
        {tier.period && (
          <span className="text-xs uppercase tracking-[0.12em] text-muted">{tier.period}</span>
        )}
      </div>
      {tier.description && (
        <p className="mt-4 text-[15px] leading-[1.7] text-body">{tier.description}</p>
      )}

      {features.length > 0 && (
        <motion.ul
          variants={staggerContainer(STAGGER * 0.75)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-8 flex-1 space-y-3 border-t border-line pt-7"
        >
          {features.map((f) => (
            <motion.li key={f} variants={fadeUp(12, DUR.fast)} className="flex items-start gap-3 text-[15px] text-body">
              <Check size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-heading" />
              {f}
            </motion.li>
          ))}
        </motion.ul>
      )}

      <div className="mt-9">
        <Button
          as={Link}
          to="/contact"
          variant={hl ? 'primary' : 'secondary'}
          className="w-full justify-center px-6 py-3"
        >
          {tier.cta || 'Start a project'}
          <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.article>
  )
}

/**
 * PricingPage — "05 — Pricing": three editorial tiers (hairline cards, the
 * middle one highlighted), feature checklists, CTAs to contact, a footnote and
 * a minimal FAQ accordion. Dashboard-driven via GET /api/pricing.
 */
export default function PricingPage() {
  const [pricing, setPricing] = useState(null)
  const [error, setError] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const load = () => {
    setError(false)
    setPricing(null)
    fetchPricing()
      .then((d) => setPricing(d || {}))
      .catch(() => setError(true))
  }

  useEffect(load, [])

  const loading = pricing === null && !error
  const tiers = Array.isArray(pricing?.tiers) ? pricing.tiers : []
  const faq = Array.isArray(pricing?.faq) ? pricing.faq : []

  return (
    <div className="pt-32 sm:pt-40">
      {/* Header */}
      <section className="container-px">
        <SectionLabel num="05">Pricing</SectionLabel>
        <SplitTextReveal
          as="h1"
          text={pricing?.heading || 'Simple, transparent pricing.'}
          amount={0.3}
          className="max-w-[18ch] font-heading text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-heading"
        />
        {pricing?.subline && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DUR.reveal, delay: 0.2, ease: EASE.out }}
            className="mt-8 max-w-[52ch] text-lg leading-[1.7] text-body"
          >
            {pricing.subline}
          </motion.p>
        )}
      </section>

      {/* Loading — skeleton tiers keep the layout stable (no blank page) */}
      {loading && (
        <section className="container-px mt-16 sm:mt-24">
          <div className="grid gap-6 lg:grid-cols-3">
            <Skeleton className="h-[26rem]" />
            <Skeleton className="h-[26rem] lg:-my-4" />
            <Skeleton className="h-[26rem]" />
          </div>
        </section>
      )}

      {/* Error — visible, with a Retry (never a silent infinite spinner) */}
      {error && (
        <section className="container-px mt-16 sm:mt-24">
          <div className="flex flex-col items-start gap-5 rounded-[6px] border border-line p-8">
            <p className="text-body">Couldn&rsquo;t load pricing — the API didn&rsquo;t respond.</p>
            <Button variant="secondary" onClick={load} className="px-6 py-2.5">
              Retry
            </Button>
          </div>
        </section>
      )}

      {/* Tiers */}
      {tiers.length > 0 && (
        <section className="container-px mt-16 sm:mt-24">
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-6 lg:grid-cols-3 lg:items-stretch"
          >
            {tiers.map((t, i) => (
              <Tier key={t.name || i} tier={t} index={i} />
            ))}
          </motion.div>

          {pricing?.note && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DUR.reveal, delay: 0.3 }}
              className="mt-8 text-xs uppercase tracking-[0.12em] text-muted"
            >
              {pricing.note}
            </motion.p>
          )}
        </section>
      )}

      {/* FAQ — a centered column: heading centered, rows in a readable
          max-width block with questions left-aligned inside it. */}
      {faq.length > 0 && (
        <section className="container-px mt-24 pb-28 sm:mt-36 sm:pb-40">
          <div className="mx-auto max-w-[46rem] text-center">
            <SectionLabel>FAQ</SectionLabel>
            <SplitTextReveal
              as="h2"
              text="Common questions."
              amount={0.4}
              className="font-heading text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-heading"
            />
            {pricing?.faq_subline && (
              <p className="mx-auto mt-5 max-w-[48ch] text-base leading-[1.7] text-body">{pricing.faq_subline}</p>
            )}
          </div>
          <motion.div
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mx-auto mt-14 max-w-[46rem] border-t border-line text-left"
          >
            {faq.map((item, i) => (
              <FaqRow
                key={i}
                item={item}
                index={i}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </motion.div>
        </section>
      )}
    </div>
  )
}
