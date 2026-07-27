import { useCallback, useEffect, useState } from 'react'
import Hero from '../components/Hero'
import Overview from '../components/Overview'
import WorkIndex from '../components/WorkIndex'
import Statement from '../components/Statement'
import Process from '../components/Process'
import Journey from '../components/Journey'
import Engagement from '../components/Engagement'
import Contact from '../components/Contact'
import { fetchPricing } from '../lib/api'
import { useSettings } from '../context/SettingsContext'

/**
 * HomePage — the whole pitch in one scroll, with proof in position two:
 *
 *   Hero (claim + proof strip)
 *   01 What I do        — capability grid
 *   02 Selected work    — the work index, with its sticky colour preview
 *      Statement        — full-bleed anchor
 *   03 How I work       — scope → build → ship → maintain
 *   04 Journey
 *   05 Ways to work together
 *   06 Contact          — form, what happens next, and the FAQ
 *
 * Recruiters and founders both scan for evidence before they read philosophy,
 * so method comes after the work it explains rather than before it.
 *
 * Pricing is fetched once here and shared by the engagement rows and the FAQ
 * under the contact form (both live in the same dashboard payload).
 */
export default function HomePage() {
  const { settings } = useSettings()
  const [pricing, setPricing] = useState(null)
  const [pricingError, setPricingError] = useState(false)

  const loadPricing = useCallback(() => {
    setPricingError(false)
    setPricing(null)
    fetchPricing()
      .then((d) => setPricing(d || {}))
      .catch(() => setPricingError(true))
  }, [])

  useEffect(loadPricing, [loadPricing])

  return (
    <>
      <Hero />
      <Overview scope="Home" index="01" />
      <WorkIndex scope="Home" index="02" />
      <Statement statement={settings.statement} />
      <Process
        steps={settings.process}
        heading={settings.process_heading}
        scope="Home"
        index="03"
      />
      <Journey scope="Home" index="04" />
      <Engagement
        pricing={pricing}
        error={pricingError}
        onRetry={loadPricing}
        scope="Home"
        index="05"
      />
      <Contact scope="Home" index="06" faq={pricing?.faq} />
    </>
  )
}
