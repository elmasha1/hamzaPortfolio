import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Preloader from '../components/Preloader'
import Cursor from '../components/Cursor'
import GrainOverlay from '../components/GrainOverlay'
import ScrollProgress from '../components/ScrollProgress'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import ScrollToTop from '../components/ScrollToTop'
import { initLenis, destroyLenis, getLenis, scrollToSelector } from '../lib/smoothScroll'

// Show the cinematic intro only once per session.
function shouldSkipIntro() {
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(window.location.search).has('skipintro')) return true
  try {
    return sessionStorage.getItem('introSeen') === '1'
  } catch {
    return false
  }
}

/**
 * SiteLayout — the persistent chrome shared by every public page (nav, footer,
 * cursor, smooth scroll, preloader, floating utilities) with a smooth
 * clip/fade page transition around the routed <Outlet />.
 */
export default function SiteLayout() {
  const [loaded, setLoaded] = useState(shouldSkipIntro)
  const location = useLocation()

  const reveal = () => {
    try {
      sessionStorage.setItem('introSeen', '1')
    } catch {
      /* ignore */
    }
    setLoaded(true)
  }

  // Start Lenis momentum smooth-scroll once revealed.
  useEffect(() => {
    if (!loaded) return
    initLenis()
    return () => destroyLenis()
  }, [loaded])

  // On route change: jump to top and re-measure ScrollTriggers. A deep link to
  // a section (/#contact) keeps its position — the effect below scrolls there.
  useEffect(() => {
    if (!location.hash) {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }
    const t = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => clearTimeout(t)
  }, [location.pathname, location.hash])

  // Deep links / shared URLs like /#contact: once the intro is out of the way
  // and the page has rendered, scroll down to the section.
  useEffect(() => {
    if (!loaded || !location.hash) return
    const t = setTimeout(() => scrollToSelector(location.hash), 500)
    return () => clearTimeout(t)
  }, [loaded, location.pathname, location.hash])

  return (
    <>
      <Cursor />

      <AnimatePresence>
        {!loaded && <Preloader onComplete={reveal} />}
      </AnimatePresence>

      {loaded && (
        <div className="relative">
          <GrainOverlay />
          <ScrollProgress />

          <div className="relative z-10">
            <Navbar />
            {/* Opacity-only crossfade — no transform, so the home WorkGallery's
                position:fixed ScrollTrigger pin isn't trapped in a new
                containing block. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.main
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Inner Suspense so a lazy page chunk loads WITHOUT unmounting
                    the nav/footer/cursor or falling back to the full-screen
                    spinner — the chrome stays put between routes. */}
                <Suspense fallback={<div className="min-h-screen" />}>
                  <Outlet />
                </Suspense>
              </motion.main>
            </AnimatePresence>
            <Footer />
          </div>

          {/* Floating utilities */}
          <WhatsAppButton />
          <ScrollToTop />
        </div>
      )}
    </>
  )
}
