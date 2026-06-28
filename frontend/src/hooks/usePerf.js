import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * useReducedEffects — returns true when heavy, continuous animations should be
 * cut back. That's the case when the user prefers reduced motion, is on a
 * touch / coarse-pointer device, or on a low-end machine (few cores / little
 * RAM). Use it to disable infinite loops, parallax, tilt and the custom cursor.
 */
export function useReducedEffects() {
  const reduce = useReducedMotion()
  const [lowPower, setLowPower] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const cores = navigator.hardwareConcurrency || 8
    const mem = navigator.deviceMemory || 8
    setLowPower(coarse || cores <= 4 || mem <= 4)
  }, [])

  return reduce || lowPower
}

/**
 * useIsTouch — true on touch / coarse-pointer devices (no fine mouse). Used to
 * disable the custom cursor and pointer-tracked tilt where they add cost but
 * no value.
 */
export function useIsTouch() {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    setTouch(!window.matchMedia('(pointer: fine)').matches)
  }, [])
  return touch
}
