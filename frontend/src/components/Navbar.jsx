import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import Button from './ui/Button'
import { ArrowRight } from './ui/Icons'
import { scrollToSelector, getLenis } from '../lib/smoothScroll'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  // Past ~40px the bar becomes a solid, full-width, edge-to-edge dark bar.
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))

  // Lock scroll while the mobile menu is open (pause Lenis too).
  useEffect(() => {
    const lenis = getLenis()
    if (open) {
      document.body.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.body.style.overflow = ''
      lenis?.start()
    }
    return () => {
      document.body.style.overflow = ''
      getLenis()?.start()
    }
  }, [open])

  const handleNav = (e, href) => {
    e.preventDefault()
    setOpen(false)
    requestAnimationFrame(() => scrollToSelector(href))
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-[250ms] ease-out ${
        scrolled
          ? 'border-line bg-[rgba(4,10,24,0.72)] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-[12px]'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav
        className={`container-px flex items-center justify-between transition-all duration-[250ms] ease-out ${
          scrolled ? 'py-2.5' : 'py-4'
        }`}
      >
        {/* Logo (stays crisp) */}
        <motion.a
          href="#home"
          onClick={(e) => handleNav(e, '#home')}
          className="font-heading text-lg font-semibold text-heading"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="text-primary">&lt;</span>
          <span className="gradient-text">Hamza</span>
          <span className="text-primary">/&gt;</span>
        </motion.a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                className="group relative rounded-lg px-3.5 py-2 text-sm font-medium tracking-[-0.01em] text-body transition-colors hover:text-heading"
              >
                {l.label}
                {/* Animated underline glow */}
                <span className="absolute inset-x-3.5 bottom-1 h-px origin-left scale-x-0 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.7)] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster: CTA (desktop) */}
        <div className="hidden items-center md:flex">
          <Button
            as="a"
            href="#contact"
            onClick={(e) => handleNav(e, '#contact')}
            className="px-4 py-2 text-sm"
          >
            Get in touch
            <ArrowRight size={16} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-line bg-white/[0.04] md:hidden"
        >
          <motion.span
            className="block h-0.5 w-5 rounded-full bg-heading"
            animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block h-0.5 w-5 rounded-full bg-heading"
            animate={open ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="block h-0.5 w-5 rounded-full bg-heading"
            animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[rgba(4,10,24,0.96)] backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, clipPath: 'circle(0% at 90% 5%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 90% 5%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 90% 5%)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={(e) => handleNav(e, l.href)}
                className="font-heading text-3xl font-medium text-heading"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                whileHover={{ scale: 1.08, color: '#3B82F6' }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4"
            >
              <Button
                as="a"
                href="#contact"
                onClick={(e) => handleNav(e, '#contact')}
                className="px-7 py-3 text-base"
              >
                Get in touch
                <ArrowRight size={18} className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
