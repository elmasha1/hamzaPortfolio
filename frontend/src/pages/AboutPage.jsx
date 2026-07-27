import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from '../components/ui/SectionLabel'
import SplitTextReveal from '../components/ui/SplitTextReveal'
import Button from '../components/ui/Button'
import Meta from '../components/ui/Meta'
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

/**
 * AboutPage — the long-form counterpart to the home page:
 *
 *   01 Intro → 02 My story (with the video as a figure inside it and the
 *   pull-quote after the first paragraph) → 03 How I decide → 04 Stack → CTA.
 *
 * "How I decide" replaces the old "Coding philosophy": each row is an opinion
 * in ink and the consequence of holding it in grey, because titles like "Clean
 * code" say nothing a recruiter hasn't read two hundred times.
 *
 * Quick facts are gone — the same numbers are the proof strip under the home
 * hero, and repeating them here weakened both.
 *
 * All content from /api/about (falls back to seeded settings defaults).
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
  // The video sits after the second paragraph — or after the last one when the
  // story is shorter than that.
  const videoAfter = Math.min(1, Math.max(0, story.length - 1))

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
          className="max-w-[20ch] font-heading text-h1 font-semibold text-ink-100"
        />
        {about.subline && (
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 max-w-[52ch] text-lead text-ink-300"
          >
            {about.subline}
          </motion.p>
        )}
      </section>

      {/* 2 — STORY */}
      {story.length > 0 && (
        <section className="container-px mt-24 sm:mt-36">
          <SectionLabel scope="About" index="02">My story</SectionLabel>
          <div className="mt-10 max-w-[66ch] space-y-7 text-lead text-ink-300">
            {story.map((para, i) => (
              <div key={i}>
                <MaskedParagraph>{para}</MaskedParagraph>

                {/* The video illustrates the story rather than opening the
                    page: a figure inside the prose with a mono caption. */}
                {i === videoAfter && about.video_url && (
                  <figure className="my-14 -mx-5 sm:mx-0">
                    <AboutVideo src={about.video_url} poster={about.video_poster || ''} />
                    {about.video_caption && (
                      <figcaption className="mt-3 px-5 sm:px-0">
                        <Meta className="tracking-[0.05em]">{about.video_caption}</Meta>
                      </figcaption>
                    )}
                  </figure>
                )}

                {/* pull-quote after the first paragraph */}
                {i === 0 && about.pull_quote && (
                  <div className="my-14 overflow-hidden">
                    <motion.blockquote
                      initial={{ y: '105%', opacity: 0 }}
                      whileInView={{ y: '0%', opacity: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      className="border-l border-rule pl-6 font-heading text-h2 font-semibold text-ink-100"
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

      {/* 3 — HOW I DECIDE — an opinion and the consequence of holding it */}
      {philosophy.length > 0 && (
        <section className="container-px mt-24 sm:mt-32">
          <SectionLabel scope="About" index="03">How I decide</SectionLabel>
          <SplitTextReveal
            as="h2"
            text="How I decide."
            amount={0.4}
            className="font-heading text-h2 font-semibold text-ink-100"
          />
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mt-12 border-t border-rule"
          >
            {philosophy.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp(24)}
                className="row grid grid-cols-[2.5rem_1fr] items-baseline gap-x-5 gap-y-2 px-2 py-7 md:grid-cols-[4rem_1fr_1fr] md:gap-x-8"
              >
                <Meta className="pt-1">{String(i + 1).padStart(2, '0')}</Meta>
                {/* The opinion, in ink */}
                <h3 className="font-heading text-h3 font-medium text-ink-100">{p.title}</h3>
                {/* Its consequence, in grey */}
                <p className="col-span-2 max-w-[52ch] text-small text-ink-300 md:col-span-1">
                  {p.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* 4 — SKILLS (reuses the grouped Technologies block) */}
      <div className="mt-10 sm:mt-16">
        <Technologies scope="About" index="04" />
      </div>

      {/* CTA. Quick facts are gone: the same numbers are the proof strip
          under the home hero, and repeating them here weakened both. */}
      <section className="container-px section-y">
        <SplitTextReveal
          as="h2"
          text="Tell me what you're building."
          amount={0.4}
          className="max-w-[16ch] font-heading text-h1 font-semibold text-ink-100"
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
          >
            Start a project
            <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Button>
          <button
            type="button"
            onClick={cv.download}
            disabled={cv.loading}
            className="group inline-flex min-h-[48px] items-center gap-2 rounded-full border border-rule px-8 text-[0.9375rem] font-medium text-ink-100 transition-colors duration-300 hover:bg-ink-100 hover:text-paper disabled:opacity-60"
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
