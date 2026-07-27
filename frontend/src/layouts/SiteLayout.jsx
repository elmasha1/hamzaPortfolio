import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'

import Cursor from '../components/Cursor'
import GrainOverlay from '../components/GrainOverlay'
import ScrollProgress from '../components/ScrollProgress'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import ScrollToTop from '../components/ScrollToTop'
import { jumpToTop, scrollToSelectorWhenReady } from '../lib/scroll'

/**
 * SiteLayout — the persistent chrome shared by every public page (nav, footer,
 * cursor, floating utilities) with a fade page transition around the routed
 * <Outlet />.
 *
 * v2: no preloader and no smooth-scroll library. First paint is content; the
 * hero's own reveal is the intro, and anchor scrolling is native.
 */
export default function SiteLayout() {
  const location = useLocation()

  // On route change: jump to top instantly. A deep link to a section
  // (/#contact) keeps its position — the effect below scrolls there.
  useEffect(() => {
    if (!location.hash) jumpToTop()
  }, [location.pathname, location.hash])

  // Deep links / shared URLs like /#contact: once the page has rendered,
  // scroll down to the section.
  useEffect(() => {
    if (!location.hash) return
    return scrollToSelectorWhenReady(location.hash)
  }, [location.pathname, location.hash])

  return (
    <div className="relative">
      <Cursor />
      <GrainOverlay />
      <ScrollProgress />

      <div className="relative z-10">
        <Navbar />
        <AnimatePresence mode="wait" initial={false}>
          <m.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Inner Suspense so a lazy page chunk loads WITHOUT unmounting the
                nav/footer/cursor — the chrome stays put between routes. */}
            <Suspense fallback={<div className="min-h-screen" />}>
              <Outlet />
            </Suspense>
          </m.main>
        </AnimatePresence>
        <Footer />
      </div>

      {/* Floating utilities */}
      <WhatsAppButton />
      <ScrollToTop />
    </div>
  )
}
