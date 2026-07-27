import { useState } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowUp, ArrowUpRight } from './ui/Icons'
import LocalTime from './LocalTime'
import Meta from './ui/Meta'
import GridOverlay from './GridOverlay'
import { scrollToTop } from '../lib/scroll'
import { useSettings } from '../context/SettingsContext'
import useSectionNav from '../hooks/useSectionNav'
import useCvDownload from '../hooks/useCvDownload'

// Work / journey / contact are sections of the home scroll, not routes.
const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Work', to: '/', hash: '#projects' },
  { label: 'Journey', to: '/', hash: '#journey' },
  { label: 'Contact', to: '/', hash: '#contact' },
]

const reveal = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * Footer — the email as display type.
 *
 * The marquee is gone (30s of animation carrying no information) and so is the
 * giant "Let's work together", which was the third instance of the same verb
 * within two screens. With one conversion moment on the page, the largest type
 * down here is free to be the thing a visitor actually needs: the address they
 * can write to directly.
 */
export default function Footer() {
  const { settings } = useSettings()
  const goToSection = useSectionNav()
  const { download: downloadCv, loading: cvLoading } = useCvDownload()
  const [grid, setGrid] = useState(false)

  const s = settings.socials || {}
  const wa = (settings.whatsapp_number || '').replace(/\D/g, '')
  const available = settings.available !== false
  const location = settings.location || ''
  const year = new Date().getFullYear()

  const socials = [
    s.linkedin && { label: 'LinkedIn', href: s.linkedin },
    s.github && { label: 'GitHub', href: s.github },
    wa && { label: 'WhatsApp', href: `https://wa.me/${wa}` },
  ].filter(Boolean)

  return (
    <footer className="relative border-t border-rule">
      <GridOverlay visible={grid} />

      <m.div
        variants={reveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="container-px pt-16 sm:pt-20"
      >
        {/* The email, as the biggest thing on the page */}
        {s.email && (
          <>
            <Meta caps className="block">
              Or write directly
            </Meta>
            <a
              href={`mailto:${s.email}`}
              className="group mt-4 block border-b border-rule pb-6 font-heading text-[clamp(2rem,7vw,5.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-ink-100 transition-colors"
            >
              <span className="bg-gradient-to-r from-ink-100 to-ink-100 bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_1px]">
                {s.email}
              </span>
            </a>
          </>
        )}

        {/* Columns */}
        <div className="grid gap-10 py-11 sm:grid-cols-2 lg:grid-cols-[repeat(3,1fr)_1.2fr] lg:gap-8">
          <div>
            <Meta caps className="mb-4 block">
              Navigate
            </Meta>
            <ul className="space-y-1.5">
              {NAV.map((n) => (
                <li key={n.label}>
                  <Link
                    to={n.hash ? n.to + n.hash : n.to}
                    onClick={n.hash ? (e) => goToSection(n.hash, e) : undefined}
                    className="group inline-flex items-center gap-1.5 text-ink-300 transition-colors hover:text-ink-100"
                  >
                    {n.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Meta caps className="mb-4 block">
              Find me online
            </Meta>
            <ul className="space-y-1.5">
              {socials.map((soc) => (
                <li key={soc.label}>
                  <a
                    href={soc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 text-ink-300 transition-colors hover:text-ink-100"
                  >
                    {soc.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={downloadCv}
                  disabled={cvLoading}
                  className="text-ink-300 transition-colors hover:text-ink-100 disabled:opacity-60"
                >
                  {cvLoading ? 'Preparing…' : 'Download CV'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <Meta caps className="mb-4 block">
              Status
            </Meta>
            <div className="space-y-1.5 font-mono text-meta text-ink-300">
              <span className="flex items-center gap-2.5">
                <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                  {available && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white/50 motion-safe:animate-pulse-ring" />
                  )}
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                      available ? 'bg-ink-100' : 'bg-ink-500'
                    }`}
                  />
                </span>
                {available ? 'Available for work' : 'Currently booked'}
              </span>
              {location && (
                <span className="block">
                  {location} · <LocalTime label="" className="tabular" showSeconds={false} />
                </span>
              )}
              {settings.response_time && <span className="block">{settings.response_time}</span>}
            </div>
          </div>

          {/* The grid toggle — a detail for the audience that will look for it */}
          <div className="lg:text-right">
            <Meta caps className="mb-4 block lg:text-right">
              Layout
            </Meta>
            <button
              type="button"
              onClick={() => setGrid((g) => !g)}
              aria-pressed={grid}
              className={`inline-flex min-h-[36px] items-center gap-2 border px-3.5 font-mono text-meta uppercase tracking-[0.06em] transition-colors duration-300 ${
                grid
                  ? 'border-ink-100 bg-ink-100 text-paper'
                  : 'border-rule text-ink-300 hover:border-ink-100 hover:text-ink-100'
              }`}
            >
              Grid: {grid ? 'on' : 'off'}
            </button>
          </div>
        </div>

        {/* Oversized wordmark → back to top */}
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="group block w-full text-left"
        >
          <span className="font-heading text-display font-semibold text-ink-100">
            Hamza<span className="text-ink-700">®</span>
          </span>
        </button>

        {/* Bottom meta */}
        <div className="mt-6 flex flex-col gap-3 border-t border-rule-soft py-6 font-mono text-meta text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} EL MASDOUKI Hamza — All rights reserved.</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-ink-100 sm:order-3"
          >
            Back to top
            <ArrowUp size={13} className="transition-transform duration-300 hover:-translate-y-0.5" />
          </button>
          <span className="sm:order-2">React · Tailwind · Laravel</span>
        </div>
      </m.div>
    </footer>
  )
}
