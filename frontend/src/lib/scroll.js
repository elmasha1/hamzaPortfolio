/**
 * Native scrolling helpers — replaces the Lenis + GSAP ScrollTrigger stack.
 *
 * `html { scroll-behavior: smooth }` does the animating and
 * `[id] { scroll-margin-top: 6rem }` clears the fixed navbar, so anchor
 * navigation needs no JS animation loop at all. Under
 * `prefers-reduced-motion` the CSS falls back to instant jumps.
 */

/** Smooth-scroll to a CSS selector (no-op when the target isn't mounted). */
export function scrollToSelector(selector) {
  const el = document.querySelector(selector)
  if (!el) return
  el.scrollIntoView({ block: 'start', inline: 'nearest' })
}

/**
 * Scroll to a selector that may not exist yet — a lazy route chunk or an
 * API-driven section can mount a few hundred ms after navigation. Polls until
 * the target appears, then gives up. Returns a cancel function.
 */
export function scrollToSelectorWhenReady(selector, { timeout = 2000, interval = 60 } = {}) {
  let elapsed = 0
  let timer = 0

  const tick = () => {
    const el = document.querySelector(selector)
    if (el) {
      el.scrollIntoView({ block: 'start', inline: 'nearest' })
      return
    }
    elapsed += interval
    if (elapsed < timeout) timer = setTimeout(tick, interval)
  }

  timer = setTimeout(tick, interval)
  return () => clearTimeout(timer)
}

/** Smooth-scroll back to the top of the page. */
export function scrollToTop() {
  window.scrollTo({ top: 0, left: 0 })
}

/**
 * Jump to the top with no animation — used on route changes, where the smooth
 * behaviour would otherwise animate the whole document away. Toggling the
 * inline style is the portable way to opt out of `scroll-behavior: smooth`.
 */
export function jumpToTop() {
  const html = document.documentElement
  const previous = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  html.style.scrollBehavior = previous
}
