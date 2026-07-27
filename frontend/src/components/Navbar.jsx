import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../context/SettingsContext'
import useCvDownload from '../hooks/useCvDownload'
import useSectionNav from '../hooks/useSectionNav'
import LocalTime from './LocalTime'
import { ArrowUpRight, Download, ArrowRight } from './ui/Icons'

// Clean, single set of canonical destinations. Everything except About is a
// section of the home scroll, so those are anchors rather than routes.
const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Work', to: '/', hash: '#projects' },
  { label: 'Journey', to: '/', hash: '#journey' },
  { label: 'Contact', to: '/', hash: '#contact' },
]

function isActivePath(pathname, l) {
  if (l.hash) return false
  return l.to === '/' ? pathname === '/' : pathname === l.to || pathname.startsWith(l.to + '/')
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { settings } = useSettings()
  const location = useLocation()
  const goToSection = useSectionNav()
  const { download: downloadCv, loading: cvLoading } = useCvDownload()

  // Scroll-aware bar: transparent at the very top → blurred dark bar past 40px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scroll while the overlay is open; close on Escape.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Close the overlay whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Navigate a link: section anchors scroll (jumping home first if needed).
  const go = (e, l) => {
    setOpen(false)
    if (!l.hash) return // let <Link> handle the route
    goToSection(l.hash, e)
  }

  const s = settings.socials || {}
  const wa = (settings.whatsapp_number || '').replace(/\D/g, '')
  const socials = [
    s.github && { label: 'GitHub', href: s.github },
    s.linkedin && { label: 'LinkedIn', href: s.linkedin },
    s.email && { label: 'Email', href: `mailto:${s.email}` },
    wa && { label: 'WhatsApp', href: `https://wa.me/${wa}` },
  ].filter(Boolean)

  const linkTo = (l) => (l.hash ? l.to + l.hash : l.to)

  return (
    <>
      {/* Top bar — full-width, scroll-aware */}
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,backdrop-filter,border-color] duration-300 ${
          scrolled
            ? 'border-b border-rule-soft bg-paper/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className={`container-px flex items-center justify-between gap-6 transition-all duration-300 ${scrolled ? 'py-3.5' : 'py-5'}`}>
          {/* Wordmark + status. Once the hero's utility rail has scrolled
              away, the availability follows the visitor down the page. */}
          <div className="flex shrink-0 items-center gap-4">
            <Link to="/" className="font-heading text-lg font-semibold tracking-[-0.02em] text-ink-100">
              Hamza<span className="text-ink-500">®</span>
            </Link>

            <AnimatePresence>
              {scrolled && settings.available !== false && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="hidden items-center gap-2 overflow-hidden whitespace-nowrap border-l border-rule-soft pl-4 font-mono text-eyebrow font-medium uppercase tracking-[0.07em] text-ink-500 sm:flex"
                >
                  <span aria-hidden="true" className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-white/50 motion-safe:animate-pulse-ring" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink-100" />
                  </span>
                  Available
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop links — the metadata voice, so the growing underline sits
              under mono rather than under letter-spaced Inter caps. */}
          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => {
              const active = isActivePath(location.pathname, l)
              return (
                <li key={l.label}>
                  <Link
                    to={linkTo(l)}
                    onClick={(e) => go(e, l)}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative block py-3 font-mono text-meta font-medium uppercase tracking-[0.07em] transition-colors hover:text-ink-100 ${
                      active ? 'text-ink-100' : 'text-ink-500'
                    }`}
                  >
                    {l.label}
                    {/* underline-grow */}
                    <span
                      className={`absolute bottom-1.5 left-0 h-px bg-ink-100 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-6 lg:flex">
            <button
              type="button"
              onClick={downloadCv}
              disabled={cvLoading}
              className="group inline-flex items-center gap-1.5 border-b border-rule py-1 font-mono text-meta font-medium uppercase tracking-[0.07em] text-ink-300 transition-colors hover:border-ink-100 hover:text-ink-100 disabled:opacity-60"
            >
              {cvLoading ? 'Preparing…' : 'CV'}
              <Download size={13} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
            <Link
              to="/#contact"
              onClick={(e) => goToSection('#contact', e)}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rule px-5 text-[0.8125rem] font-medium text-ink-100 transition-colors duration-300 hover:bg-ink-100 hover:text-paper"
            >
              Start a project
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="group flex min-h-[44px] items-center gap-2.5 font-mono text-meta font-medium uppercase tracking-[0.07em] text-ink-100 lg:hidden"
          >
            {open ? 'Close' : 'Menu'}
            <span className="relative flex h-3.5 w-4 flex-col justify-center gap-1">
              <span className={`block h-px w-full bg-current transition-transform duration-300 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
              <span className={`block h-px w-full bg-current transition-transform duration-300 ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
            </span>
          </button>
        </nav>
      </header>

      {/* Full-screen menu overlay (mobile / tablet) — clip-path wipe + staggered links */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-paper px-5 pb-8 pt-24 sm:px-8 sm:pb-12 lg:hidden"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="mt-auto flex flex-col gap-2 sm:gap-3">
              {LINKS.map((l, i) => {
                const active = isActivePath(location.pathname, l)
                return (
                  <div key={l.label} className="overflow-hidden">
                    <motion.div
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.06 }}
                    >
                      <Link
                        to={linkTo(l)}
                        onClick={(e) => go(e, l)}
                        aria-current={active ? 'page' : undefined}
                        className={`group inline-flex items-baseline gap-4 font-heading text-[clamp(2.5rem,9vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.03em] transition-colors hover:text-ink-100 ${active ? 'text-ink-100' : 'text-ink-500'}`}
                      >
                        <span className={`font-mono text-meta ${active ? 'text-ink-100' : 'text-ink-700'}`}>0{i + 1}</span>
                        {l.label}
                      </Link>
                    </motion.div>
                  </div>
                )
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="mt-12 flex flex-col gap-6 border-t border-rule pt-6 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {socials.map((soc) => (
                  <a key={soc.label} href={soc.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 text-sm text-ink-500 transition-colors hover:text-ink-100">
                    {soc.label}
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
                <button type="button" onClick={downloadCv} disabled={cvLoading} className="group inline-flex items-center gap-1 text-sm text-ink-500 transition-colors hover:text-ink-100 disabled:opacity-60">
                  {cvLoading ? 'Preparing…' : 'Download CV'}
                  <Download size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              </div>
              <LocalTime className="text-xs uppercase tracking-[0.14em] text-ink-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
