import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from './ui/Icons'
import { scrollToSelector } from '../lib/smoothScroll'

/**
 * ScrollToTop — a subtle button that appears after scrolling down a bit and
 * smooth-scrolls (via Lenis) back to the top.
 */
export default function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          aria-label="Scroll to top"
          onClick={() => scrollToSelector('#home')}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-24 right-7 z-[70] flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/[0.06] text-primary shadow-[0_0_22px_-6px_rgba(59,130,246,0.55)] backdrop-blur-md transition-shadow hover:shadow-[0_0_28px_-4px_rgba(59,130,246,0.7)]"
        >
          <ArrowUp size={20} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
