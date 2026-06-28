import Lenis from 'lenis'

/**
 * Thin wrapper around Lenis so the whole app can share one instance and
 * navigation links can smooth-scroll through it. Falls back to native
 * scrolling when Lenis is disabled (reduced motion / touch).
 */
let lenis = null

let rafId = 0

export function initLenis() {
  if (typeof window === 'undefined' || lenis) return lenis
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  // Honor reduced-motion, and leave native (already smooth) scrolling in place
  // on touch devices so Lenis never fights the OS momentum scroller.
  if (reduce || coarse) return null

  lenis = new Lenis({
    duration: 1.1,
    // easeOutExpo for a smooth, weighted momentum feel
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false, // never hijack touch scrolling
    wheelMultiplier: 1,
  })

  const raf = (time) => {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
  return lenis
}

export function getLenis() {
  return lenis
}

/** Smooth-scroll to a CSS selector, via Lenis when available. */
export function scrollToSelector(selector) {
  const el = document.querySelector(selector)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset: -16, duration: 1.2 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function destroyLenis() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
}
