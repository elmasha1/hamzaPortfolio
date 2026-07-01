import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Shared Lenis instance, synced with GSAP ScrollTrigger so scroll-driven
 * animations (pins, scrubs, the horizontal gallery) stay perfectly in step
 * with the inertia scroll. Falls back to native scrolling — and lets
 * ScrollTrigger run on native scroll — on touch / reduced-motion.
 */
let lenis = null
let tickerFn = null

export function initLenis() {
  if (typeof window === 'undefined' || lenis) return lenis
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  // Honor reduced-motion and leave native (already smooth) scrolling on touch
  // so Lenis never fights the OS momentum scroller. ScrollTrigger still works.
  if (reduce || coarse) return null

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // easeOutExpo
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
  })

  // Drive Lenis from GSAP's ticker and update ScrollTrigger on every scroll —
  // the canonical Lenis × ScrollTrigger wiring.
  lenis.on('scroll', ScrollTrigger.update)
  tickerFn = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tickerFn)
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis() {
  return lenis
}

/** Smooth-scroll to a CSS selector, via Lenis when available. */
export function scrollToSelector(selector) {
  const el = document.querySelector(selector)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function destroyLenis() {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn)
    tickerFn = null
  }
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
}
