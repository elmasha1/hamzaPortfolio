import { useReducedMotion } from 'framer-motion'

/**
 * useReducedEffects — true when animation should be cut back to opacity-only.
 *
 * v2: layouts no longer branch on device capability. The pinned horizontal
 * gallery and its second, touch-only implementation are gone, so the old
 * coarse-pointer / core-count / device-memory heuristics have nothing left to
 * switch. What remains is the user's own stated preference, which is the only
 * signal we should have been acting on.
 */
export function useReducedEffects() {
  return useReducedMotion()
}
