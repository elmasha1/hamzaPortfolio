import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from '../components/ui/SectionLabel'
import SplitTextReveal from '../components/ui/SplitTextReveal'
import Button from '../components/ui/Button'
import Technologies from '../components/Technologies'
import AboutVideo from '../components/AboutVideo'
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin, Mail, Whatsapp } from '../components/ui/Icons'
import { fetchAbout } from '../lib/api'
import { useSettings } from '../context/SettingsContext'
import useCvDownload from '../hooks/useCvDownload'
import useSectionNav from '../hooks/useSectionNav'

/* A paragraph that rises out from behind an overflow-hidden mask on scroll. */
function MaskedParagraph({ children, className = '' }) {
  return (
    <div className="overflow-hidden">
      <motion.p
        initial={{ y: '110%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.p>
    </div>
  )
}

/* Count-up number for the quick-facts strip. */
function Counter({ value, suffix }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    let raf
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 1400)
      const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
      setN(Math.round(e * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduce])
  return (
    <span ref={ref} className="tabular">
      {n}
      {suffix}
    </span>
  )
}

/**
 * AboutPage — an editorial, animation-rich narrative About page: intro, a
 * dashboard-configurable intro VIDEO, a story with pull-quote, coding
 * philosophy, grouped skills, quick facts, and a CTA. All content from
 * /api/about (falls back to seeded settings defaults). B/W theme + split-text /
 * mask reveals consistent with the rest of the site.
 */
export default function AboutPage() {
  const { settings } = useSettings()
  const goToSection = useSectionNav()
  const cv = useCvDownload()
  const [about, setAbout] = useState(settings.about || {})

  useEffect(() => {
    let alive = true
    fetchAbout()
      .then((d) => alive && d && setAbout(d))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const story = Array.isArray(about.story) ? about.story : []
  const philosophy = Array.isArray(about.philosophy) ? about.philosophy : []
  const facts = Array.isArray(about.facts) ? about.facts : []

  const s = settings.socials || {}
  const wa = (settings.whatsapp_number || '').replace(/\D/g, '')
  const socials = [
    s.github && { label: 'GitHub', href: s.github, Icon: Github },
    s.linkedin && { label: 'LinkedIn', href: s.linkedin, Icon: Linkedin },
    s.email && { label: 'Email', href: `mailto:${s.email}`, Icon: Mail },
    wa && { label: 'WhatsApp', href: `https://wa.me/${wa}`, Icon: Whatsapp },
  ].filter(Boolean)

  return (
    <div className="pt-32 sm:pt-40">
      {/* 1 — INTRO */}
      <section className="container-px">
        <SectionLabel scope="About" index="01">Intro</SectionLabel>
        <SplitTextReveal
          as="h1"
          text={about.headline || 'From idea to production — this is who I am.'}
          amount={0.3}
          className="max-w-[20ch] font-heading text-[clamp(2.25rem,6vw,4.75rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-ink-100"
        />
        {about.subline && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 max-w-[52ch] text-lg leading-[1.7] text-ink-300"
          >
            {about.subline}
          </motion.p>
        )}
      </section>

      {/* 2 — VIDEO */}
      <section className="container-px mt-16 sm:mt-24">
        <AboutVideo src={about.video_url || ''} poster={about.video_poster || ''} />
      </section>

      {/* 3 — STORY */}
      {story.length > 0 && (
        <section className="container-px mt-24 sm:mt-36">
          <SectionLabel scope="About" index="02">My story</SectionLabel>
          <div className="mt-10 max-w-[62ch] space-y-7 text-lg leading-[1.75] text-ink-300">
            {story.map((para, i) => (
              <div key={i}>
                <MaskedParagraph>{para}</MaskedParagraph>
                {/* pull-quote after the first paragraph */}
                {i === 0 && about.pull_quote && (
                  <div className="my-14 overflow-hidden">
                    <motion.blockquote
                      initial={{ y: '105%', opacity: 0 }}
                      whileInView={{ y: '0%', opacity: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      className="border-l border-rule pl-6 font-heading text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-ink-100"
                    >
                      “{about.pull_quote}”
                    </motion.blockquote>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4 — PHILOSOPHY */}
      {philosophy.length > 0 && (
        <section className="container-px mt-24 sm:mt-36">
          <SectionLabel scope="About" index="03">What drives me</SectionLabel>
          <SplitTextReveal
            as="h2"
            text="Coding philosophy."
            amount={0.4}
            className="font-heading text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink-100"
          />
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 border-t border-rule"
          >
            {philosophy.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp(24)}
                className="group grid grid-cols-[3rem_1fr] gap-x-5 gap-y-1 border-b border-rule py-7 transition-colors hover:bg-white/[0.02] md:grid-cols-[4rem_0.5fr_1fr] md:items-baseline md:gap-8"
              >
                <span className="font-heading text-sm text-ink-500 transition-colors group-hover:text-ink-100">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-heading text-xl font-semibold tracking-[-0.01em] text-ink-100 sm:text-2xl">
                  {p.title}
                </h3>
                <p className="col-span-2 max-w-md text-[15px] leading-[1.7] text-ink-300 md:col-span-1">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 5 — SKILLS (reuses the grouped Technologies block) */}
      <div className="mt-10 sm:mt-16">
        <Technologies scope="About" index="04" />
      </div>

      {/* 6 — QUICK FACTS */}
      {facts.length > 0 && (
        <section className="container-px">
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-2 gap-x-6 gap-y-12 border-y border-rule py-16 sm:py-20 md:grid-cols-3 md:gap-x-0 md:divide-x md:divide-rule-soft"
          >
            {facts.map((f, i) => (
              <motion.div key={i} variants={fadeUp(24)} className="md:px-10 md:first:pl-0">
                <div className="font-heading text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-ink-100">
                  {typeof f.value === 'number' ? <Counter value={f.value} suffix={f.suffix || ''} /> : f.text}
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink-500">{f.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 7 — CTA */}
      <section className="container-px py-28 sm:py-40">
        <SplitTextReveal
          as="h2"
          text="Let's work together."
          amount={0.4}
          className="max-w-[16ch] font-heading text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink-100"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button
            as="a"
            href="/#contact"
            onClick={(e) => goToSection('#contact', e)}
            className="px-7 py-3"
          >
            Get in touch
            <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Button>
          <button
            type="button"
            onClick={cv.download}
            disabled={cv.loading}
            data-cursor="hover"
            className="group inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-sm text-ink-100 transition-colors hover:bg-ink-100 hover:text-paper disabled:opacity-60"
          >
            {cv.loading ? 'Preparing…' : 'Download CV'}
            <Download size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        </motion.div>

        {socials.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-8">
            {socials.map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="group inline-flex items-center gap-2 text-sm text-ink-300 transition-colors hover:text-ink-100"
              >
                <soc.Icon size={16} />
                {soc.label}
                <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
