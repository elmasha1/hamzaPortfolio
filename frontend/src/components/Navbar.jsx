import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getLenis } from '../lib/smoothScroll'
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
  { label: 'Pricing', to: '/', hash: '#pricing' },
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

  // Lock scroll + pause Lenis while the overlay is open; close on Escape.
  useEffect(() => {
    const lenis = getLenis()
    if (open) {
      document.body.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.body.style.overflow = ''
      lenis?.start()
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      getLenis()?.start()
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
          scrolled ? 'border-b border-line bg-ink/80 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className={`container-px flex items-center justify-between gap-6 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
          {/* Wordmark */}
          <Link to="/" className="shrink-0 font-heading text-base font-semibold tracking-[-0.02em] text-heading">
            Hamza<span className="text-muted">®</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => {
              const active = isActivePath(location.pathname, l)
              return (
                <li key={l.label}>
                  <Link
                    to={linkTo(l)}
                    onClick={(e) => go(e, l)}
                    data-cursor="hover"
                    aria-current={active ? 'page' : undefined}
                    className={`group relative text-sm transition-colors hover:text-heading ${active ? 'text-heading' : 'text-body'}`}
                  >
                    {l.label}
                    {/* underline-grow */}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-white transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-5 lg:flex">
            <button
              type="button"
              onClick={downloadCv}
              disabled={cvLoading}
              data-cursor="hover"
              className="group inline-flex items-center gap-1.5 text-sm text-body transition-colors hover:text-heading disabled:opacity-60"
            >
              {cvLoading ? 'Preparing…' : 'CV'}
              <Download size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
            <Link
              to="/#contact"
              onClick={(e) => goToSection('#contact', e)}
              data-cursor="hover"
              className="group inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-heading transition-colors hover:bg-white hover:text-ink"
            >
              Get in touch
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            data-cursor="hover"
            className="group flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.14em] text-heading lg:hidden"
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
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-ink px-5 pb-8 pt-24 sm:px-8 sm:pb-12 lg:hidden"
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
                        data-cursor="hover"
                        aria-current={active ? 'page' : undefined}
                        className={`group inline-flex items-baseline gap-4 font-heading text-[clamp(2.5rem,9vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.03em] transition-colors hover:text-heading ${active ? 'text-heading' : 'text-muted'}`}
                      >
                        <span className={`font-sans text-xs tracking-[0.1em] ${active ? 'text-heading' : 'text-muted/70'}`}>0{i + 1}</span>
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
              className="mt-12 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {socials.map((soc) => (
                  <a key={soc.label} href={soc.href} target="_blank" rel="noreferrer" data-cursor="hover" className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-heading">
                    {soc.label}
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
                <button type="button" onClick={downloadCv} disabled={cvLoading} data-cursor="hover" className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-heading disabled:opacity-60">
                  {cvLoading ? 'Preparing…' : 'Download CV'}
                  <Download size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              </div>
              <LocalTime className="text-xs uppercase tracking-[0.14em] text-muted" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
