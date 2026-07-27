import Hero from '../components/Hero'
import Overview from '../components/Overview'
import Journey from '../components/Journey'
import WorkGallery from '../components/WorkGallery'
import Pricing from '../components/Pricing'
import Contact from '../components/Contact'

/**
 * HomePage — the whole public site in one scroll: hero → overview ("this is
 * what I do") → journey timeline → selected work → pricing + FAQ → contact
 * form. About lives on its own route; everything else is a section here
 * (#projects / #pricing / #contact).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Overview />
      <Journey />
      <WorkGallery />
      <Pricing />
      <Contact num="05" />
    </>
  )
}
