import Hero from '../components/Hero'
import Overview from '../components/Overview'
import Journey from '../components/Journey'
import WorkGallery from '../components/WorkGallery'

/**
 * HomePage — the home scroll: hero → overview ("this is what I do") → journey
 * timeline → selected work (which ends with a "let's work together" CTA panel).
 * The full contact form is the canonical /contact page; About / Projects / Blog
 * live on their own routes.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Overview />
      <Journey />
      <WorkGallery />
    </>
  )
}
