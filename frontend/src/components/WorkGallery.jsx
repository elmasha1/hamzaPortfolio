import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProjects } from '../lib/api'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import { ArrowUpRight } from './ui/Icons'

const FALLBACK = [
  { id: 1, title: 'Atlas — SaaS Platform', role: 'Lead full-stack', tech_tags: ['React', 'Laravel', 'MySQL'], image: '' },
  { id: 2, title: 'Ledger — Payments API', role: 'Backend engineer', tech_tags: ['Laravel', 'REST'], image: '' },
  { id: 3, title: 'Pulse — Realtime Dashboard', role: 'Full-stack', tech_tags: ['React', 'WebSockets'], image: '' },
]

const placeholder = (title) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#141414'/><text x='50%' y='50%' fill='#7E7B76' font-family='JetBrains Mono,monospace' font-size='24' text-anchor='middle' dominant-baseline='middle'>${title}</text></svg>`
  )

/* A single work tile — masked image + editorial meta. */
function Tile({ project, index, onOpen }) {
  const tags = Array.isArray(project.tech_tags) ? project.tech_tags : []
  return (
    <motion.article
      variants={fadeUp()}
      data-cursor="view"
      onClick={() => onOpen(project)}
      className="group w-full cursor-pointer"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-rule bg-paper-2">
        <motion.img
          src={project.image || placeholder(project.title)}
          alt={`${project.title} — project screenshot`}
          loading="lazy"
          decoding="async"
          onError={(e) => (e.currentTarget.src = placeholder(project.title))}
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0"
        />
        <span className="meta absolute left-4 top-4 text-ink-300">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-h3 font-medium text-ink-100">{project.title}</h3>
          {project.role && <p className="meta mt-1">{project.role}</p>}
        </div>
        <ArrowUpRight
          size={22}
          className="mt-1 shrink-0 text-ink-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink-100"
        />
      </div>

      {tags.length > 0 && (
        <div className="meta mt-3 flex flex-wrap gap-x-3 gap-y-1 uppercase">
          {tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
    </motion.article>
  )
}

/**
 * WorkGallery — selected work as a vertical grid.
 *
 * v2 (P0): the GSAP-pinned horizontal track and its separate touch layout are
 * gone; one layout serves every device. This component is superseded by
 * WorkIndex in P1.
 */
export default function WorkGallery() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    fetchProjects()
      .then((d) => alive && setProjects(Array.isArray(d) && d.length ? d : FALLBACK))
      .catch(() => alive && setProjects(FALLBACK))
    return () => {
      alive = false
    }
  }, [])

  const onOpen = (p) => navigate(`/work/${p.id}`)

  return (
    <section id="projects" className="section-y relative">
      <div className="container-px">
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionLabel num="03">Selected work</SectionLabel>
          <SplitTextReveal
            as="h2"
            text="Engineering case studies — real products, real outcomes."
            amount={0.4}
            className="max-w-3xl font-heading text-h2 font-semibold text-ink-100"
          />
        </motion.div>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2"
        >
          {projects.map((p, i) => (
            <Tile key={p.id} project={p} index={i} onOpen={onOpen} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
