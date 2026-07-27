import { useEffect, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { ArrowUp } from './ui/Icons'
import { scrollToTop } from '../lib/scroll'

/**
 * ScrollToTop — a subtle button that appears after scrolling down a bit and
 * smooth-scrolls back to the top.
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
        <m.button
          aria-label="Scroll to top"
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-[5.25rem] right-6 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-rule bg-paper text-ink-100 transition-colors hover:bg-ink-100 hover:text-paper"
        >
          <ArrowUp size={20} strokeWidth={2} />
        </m.button>
      )}
    </AnimatePresence>
  )
}
