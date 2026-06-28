import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Starfield from './components/Starfield'
import CosmicDecor from './components/CosmicDecor'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import TechStack from './components/TechStack'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ScrollToTop from './components/ScrollToTop'
import { initLenis, destroyLenis } from './lib/smoothScroll'

/**
 * PublicSite — the full public-facing portfolio (everything that used to live
 * in App). Wrapped by SettingsProvider so all content is dashboard-driven.
 */
// Opt-in escape hatch to skip the intro preloader (e.g. deep links / testing):
// visit any URL with `?skipintro`. Normal visitors never trigger it.
function shouldSkipIntro() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('skipintro')
}

export default function PublicSite() {
  const [loaded, setLoaded] = useState(shouldSkipIntro)

  // Start Lenis momentum smooth-scroll once the site is revealed.
  useEffect(() => {
    if (!loaded) return
    initLenis()
    return () => destroyLenis()
  }, [loaded])

  return (
    <>
      <Cursor />

      <AnimatePresence>
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Starfield />
          <CosmicDecor />
          <ScrollProgress />

          <div className="relative z-10">
            <Navbar />
            <main>
              <Hero />
              <Stats />
              <About />
              <TechStack />
              <Projects />
              <Contact />
            </main>
            <Footer />
          </div>

          {/* Floating utilities */}
          <WhatsAppButton />
          <ScrollToTop />
        </motion.div>
      )}
    </>
  )
}
