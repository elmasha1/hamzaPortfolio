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
          data-cursor="hover"
          className="fixed bottom-[5.25rem] right-6 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-line bg-ink text-heading transition-colors hover:bg-white hover:text-ink"
        >
          <ArrowUp size={20} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
