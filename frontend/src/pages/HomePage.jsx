import { useCallback, useEffect, useState } from 'react'
import Hero from '../components/Hero'
import Overview from '../components/Overview'
import WorkIndex from '../components/WorkIndex'
import Statement from '../components/Statement'
import Process from '../components/Process'
import Journey from '../components/Journey'
import BleedImage from '../components/BleedImage'
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
 *      BleedImage       — full-bleed anchor, the one colour moment
 *   05 Ways to work together
 *   06 Contact          — form, what happens next, and the FAQ
 *
 * Recruiters and founders both scan for evidence before they read philosophy,
 * so method comes after the work it explains rather than before it.
 *
 * Pricing is fetched once here and shared by the engagement rows and the FAQ
 * under the contact form (both live in the same dashboard payload).
 */
/**
 * Section numbers are assigned from the sections that will actually render,
 * never hard-coded: an empty dashboard hides a section, and the numbering has
 * to close up behind it rather than leave a hole (01, 02, 04…).
 */
function useSectionNumbers(visible) {
  let n = 0
  return visible.map((isVisible) => (isVisible ? String(++n).padStart(2, '0') : null))
}

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

  const has = (v) => Array.isArray(v) && v.length > 0
  // Work always renders (it falls back to seed projects), and so does Contact.
  // Engagement counts while its data is still loading, because the skeleton
  // rows hold the section's place.
  const [nOverview, nWork, nProcess, nJourney, nEngagement, nContact] = useSectionNumbers([
    has(settings.overview_items),
    true,
    has(settings.process),
    has(settings.journey),
    !pricingError,
    true,
  ])

  return (
    <>
      <Hero />
      <Overview scope="Home" index={nOverview} />
      <WorkIndex scope="Home" index={nWork} />
      <Statement statement={settings.statement} />
      <Process
        steps={settings.process}
        heading={settings.process_heading}
        scope="Home"
        index={nProcess}
      />
      <Journey scope="Home" index={nJourney} />
      <BleedImage />
      <Engagement
        pricing={pricing}
        error={pricingError}
        onRetry={loadPricing}
        scope="Home"
        index={nEngagement}
      />
      <Contact scope="Home" index={nContact} faq={pricing?.faq} />
    </>
  )
}
