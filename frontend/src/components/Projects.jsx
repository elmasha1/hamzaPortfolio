import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchProjects } from '../lib/api'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import { Filter } from './ui/Icons'
import StickerField from './Stickers'
import ProjectCard from './ProjectCard'

// Code-split the detail modal so its markup/animation code isn't in the
// initial bundle — it only loads when a project is first opened.
const ProjectModal = lazy(() => import('./ProjectModal'))

// Fallback data so the section still looks great if the API is offline.
const FALLBACK = [
  {
    id: 1,
    title: 'TaskFlow — Kanban App',
    description:
      'A real-time Kanban board with drag & drop, built in React with a Laravel API and MySQL persistence.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    tech_tags: ['React', 'Laravel', 'MySQL'],
    live_url: '#',
    github_url: '#',
  },
  {
    id: 2,
    title: 'ShopWave — E-commerce',
    description:
      'A modern storefront with cart, checkout and an admin dashboard. Tailwind UI + Laravel REST API.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    tech_tags: ['React', 'Tailwind', 'Laravel'],
    live_url: '#',
    github_url: '#',
  },
  {
    id: 3,
    title: 'PulseAnalytics',
    description:
      'An animated analytics dashboard with live charts and websockets. Heavy Framer Motion usage.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tech_tags: ['React', 'Framer Motion'],
    live_url: '#',
    github_url: '#',
  },
]

const FILTERS = ['All', 'React', 'Laravel', 'Full-stack']

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | error
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState(null) // project shown in the modal

  useEffect(() => {
    let alive = true
    fetchProjects()
      .then((data) => {
        if (!alive) return
        setProjects(Array.isArray(data) && data.length ? data : FALLBACK)
        setStatus('ok')
      })
      .catch(() => {
        if (!alive) return
        setProjects(FALLBACK) // graceful fallback
        setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  // Filter by tech tag (case-insensitive). "Full-stack" = uses React + Laravel.
  const visible = useMemo(() => {
    if (active === 'All') return projects
    return projects.filter((p) => {
      const tags = (p.tech_tags || []).map((t) => t.toLowerCase())
      if (active === 'Full-stack') {
        return (
          (tags.includes('react') && tags.includes('laravel')) ||
          tags.includes('full-stack')
        )
      }
      return tags.includes(active.toLowerCase())
    })
  }, [projects, active])

  return (
    <section id="projects" className="relative overflow-hidden py-24">
      <StickerField density={0.8} />

      <div className="container-px relative z-10">
        {/* Header */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="text-center"
        >
          <motion.span variants={fadeUp()} className="eyebrow mb-4">
            Portfolio
          </motion.span>
          <motion.h2 variants={fadeUp()} className="section-title">
            Selected <span className="gradient-text">work</span>
          </motion.h2>
          <motion.p
            variants={fadeUp()}
            className="mx-auto mt-4 max-w-xl text-body"
          >
            A selection of things I've designed and built — hover a card to
            explore it in 3D.
          </motion.p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          <Filter size={18} className="mr-1 text-muted" aria-hidden="true" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`relative rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
                active === f ? 'text-white' : 'text-body hover:text-primary'
              }`}
            >
              {/* Animated active pill that slides between tabs */}
              {active === f && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-xl bg-primary shadow-soft"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              {f}
            </button>
          ))}
        </motion.div>

        {/* Loading skeleton */}
        {status === 'loading' && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-3xl bg-white/[0.05] shadow-soft"
              />
            ))}
          </div>
        )}

        {/* Grid with staggered + animated reordering */}
        {status !== 'loading' && (
          <motion.div
            layout
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {/* First project is FEATURED (wide, badge, stronger tilt) to
                  anchor the visual hierarchy; the rest fill the grid. */}
              {visible.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  featured={i === 0}
                  onOpen={setSelected}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Animated case-study detail modal (lazy-loaded) */}
        <Suspense fallback={null}>
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        </Suspense>

        {/* Empty state for a filter with no matches */}
        {status !== 'loading' && visible.length === 0 && (
          <p className="mt-12 text-center text-muted">
            No projects match “{active}” yet — check back soon!
          </p>
        )}

        {status === 'error' && (
          <p className="mt-6 text-center text-sm text-muted">
            (Showing sample projects — API not reachable.)
          </p>
        )}
      </div>
    </section>
  )
}
