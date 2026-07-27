import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import GrainOverlay from './components/GrainOverlay'
import { ArrowLeft } from './components/ui/Icons'

/** Minimal, on-theme 404 page for unknown routes. */
export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — 404'
  }, [])

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      <GrainOverlay />
      <m.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center"
      >
        <p className="eyebrow mb-5">Error 404</p>
        <h1 className="font-heading text-[clamp(4rem,16vw,11rem)] font-semibold leading-none tracking-[-0.03em] text-ink-100">
          404
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-ink-300">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-paper transition hover:bg-white/90"
        >
          <ArrowLeft size={18} /> Back to home
        </Link>
      </m.div>
    </div>
  )
}
