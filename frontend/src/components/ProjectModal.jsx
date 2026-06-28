import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BrowserFrame from './BrowserFrame'
import { ExternalLink, Github, X } from './ui/Icons'

/**
 * ProjectModal — an animated case-study detail view. Opens when a project is
 * selected; closes on overlay click, the × button, or Escape.
 */
export default function ProjectModal({ project, onClose }) {
  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!project) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose])

  const tags = project && Array.isArray(project.tech_tags) ? project.tech_tags : []

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-dark/60 p-4 backdrop-blur-sm sm:items-center sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} details`}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            className="relative my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-line bg-white/[0.04] shadow-soft-lg"
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-heading shadow-soft transition hover:scale-110"
            >
              <X size={18} />
            </button>

            {/* Screenshot */}
            <div className="bg-base-indigo p-5 sm:p-8">
              <BrowserFrame url={project.live_url || 'localhost:3000'}>
                <img
                  src={project.image}
                  alt={`Screenshot of ${project.title}`}
                  loading="lazy"
                  decoding="async"
                  width="640"
                  height="400"
                  className="aspect-[16/10] w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'data:image/svg+xml;utf8,' +
                      encodeURIComponent(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="100%" height="100%" fill="#0B1B36"/><text x="50%" y="50%" font-family="'Space Grotesk',Inter,sans-serif" font-size="28" fill="#93C5FD" text-anchor="middle" dominant-baseline="middle">${project.title}</text></svg>`
                      )
                  }}
                />
              </BrowserFrame>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8">
              <h3 className="font-heading text-2xl font-semibold text-heading sm:text-3xl">
                {project.title}
              </h3>

              {project.role && (
                <p className="mt-1 text-sm font-medium text-primary">
                  {project.role}
                </p>
              )}

              <p className="mt-4 text-body">
                {project.description}
              </p>

              {/* Tech stack */}
              {tags.length > 0 && (
                <>
                  <p className="eyebrow mt-6">Tech stack</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="pill bg-base-indigo px-3 py-1 text-xs font-medium text-primary-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {/* Links */}
              <div className="mt-8 flex flex-wrap gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary px-5 py-2.5 text-sm"
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <ExternalLink /> Live demo
                    </span>
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary px-5 py-2.5 text-sm"
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <Github /> GitHub
                    </span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
