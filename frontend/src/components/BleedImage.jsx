import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProjects } from '../lib/api'
import Meta from './ui/Meta'

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
        // The list arrives featured-first, so this is the project you chose to
        // lead with — as long as it actually has a screen to show.
        setProject(list.find((p) => p?.image) || null)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  if (!project) return null

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="border-y border-rule"
    >
      <Link to={`/work/${project.id}`} data-cursor="view" className="group relative block">
        <img
          src={project.image}
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
    </motion.section>
  )
}
