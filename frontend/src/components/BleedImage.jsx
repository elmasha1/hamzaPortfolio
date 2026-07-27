import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { fetchProjects } from '../lib/api'
import Meta from './ui/Meta'
import { img, imgSrcSet } from '../lib/cloudinary'

/**
 * Which project the anchor shows, advanced once per visit.
 *
 * A counter in localStorage steps forward on every page load, so a returning
 * visitor meets a different piece of work each time and the whole portfolio
 * eventually gets its turn in colour — in order, not at random, so nothing
 * repeats until everything has been shown.
 *
 * Resolved once per page load and cached in module scope: React's StrictMode
 * double-mount, and any re-entry to the home route during the same visit, all
 * see the same project rather than shuffling under the visitor.
 */
const VISIT_KEY = 'anchor-visit'
let visitCounter = null

function resolveVisitCounter() {
  if (visitCounter !== null) return visitCounter
  try {
    const stored = Number(window.localStorage.getItem(VISIT_KEY)) || 0
    // Wrap well below MAX_SAFE_INTEGER; the modulo makes the value itself
    // meaningless beyond "one more than last time".
    window.localStorage.setItem(VISIT_KEY, String((stored + 1) % 100000))
    visitCounter = stored
  } catch {
    // Storage blocked (private mode, cookie settings) — still vary the pick.
    visitCounter = Math.floor(Math.random() * 100000)
  }
  return visitCounter
}

/**
 * BleedImage — the third visual anchor: a full-bleed 21:9 crop of one real
 * product screen, at full colour, linking to its case study.
 *
 * It is the only full-colour full-bleed moment on the home page, and it sits
 * immediately before the engagement rows — the point where a client decides
 * whether to keep reading. Everything else on the page rests in grayscale, so
 * this lands as a change of state rather than as decoration.
 *
 * Self-hides when no project has an image: an empty database gets no anchor
 * rather than a fake one.
 */
export default function BleedImage() {
  const [project, setProject] = useState(null)

  useEffect(() => {
    let alive = true
    fetchProjects()
      .then((list) => {
        if (!alive || !Array.isArray(list)) return
        // Only projects with a real screen can take the slot — the anchor is
        // the one place on the page that must not show a placeholder.
        const withImage = list.filter((p) => p?.image)
        if (withImage.length === 0) {
          setProject(null)
          return
        }
        setProject(withImage[resolveVisitCounter() % withImage.length])
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  if (!project) return null

  return (
    <m.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border-y border-rule"
    >
      <Link to={`/work/${project.id}`} data-cursor="view" className="group relative block">
        <img
          src={img(project.image, 1920)}
          srcSet={imgSrcSet(project.image)}
          sizes="100vw"
          alt={`${project.title} — product screen`}
          loading="lazy"
          decoding="async"
          width="2400"
          height="1029"
          className="aspect-[21/9] w-full object-cover"
        />

        {/* Caption rail — legible over any screenshot without a scrim over the
            whole image. */}
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 bg-gradient-to-t from-paper/90 to-transparent px-5 pb-5 pt-16 sm:px-8 lg:px-14">
          <Meta caps className="tracking-[0.06em]">
            {project.title}
            {project.year ? ` · ${project.year}` : ''}
          </Meta>
          <Meta caps tone="ink" className="tracking-[0.06em]">
            Read the case study{' '}
            <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Meta>
        </div>
      </Link>
    </m.section>
  )
}
