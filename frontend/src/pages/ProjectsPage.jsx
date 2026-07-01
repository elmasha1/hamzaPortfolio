import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProjects } from '../lib/api'
import { staggerContainer, fadeUp } from '../lib/motion'
import { ArrowUpRight } from '../components/ui/Icons'
import SectionLabel from '../components/ui/SectionLabel'
import SplitTextReveal from '../components/ui/SplitTextReveal'

const placeholder = (title) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#141414'/><text x='50%' y='50%' fill='#666' font-family='Space Grotesk,Inter,sans-serif' font-size='28' text-anchor='middle' dominant-baseline='middle'>${title}</text></svg>`
  )

/* Same tile design as the home WorkGallery — vertical grid variant. */
function Tile({ project, index, onOpen }) {
  const tags = Array.isArray(project.tech_tags) ? project.tech_tags : []
  return (
    <motion.article
      variants={fadeUp(28)}
      data-cursor="view"
      onClick={() => onOpen(project)}
      className="group w-full cursor-pointer"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-line bg-base-indigo">
        <motion.img
          src={project.image || placeholder(project.title)}
          alt={`${project.title} — project screenshot`}
          loading="lazy"
          decoding="async"
          onError={(e) => (e.currentTarget.src = placeholder(project.title))}
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:grayscale-0"
        />
        <span className="absolute left-4 top-4 font-heading text-xs text-white/70">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-semibold text-heading transition-colors group-hover:text-white sm:text-2xl">
            {project.title}
          </h3>
          {project.role && <p className="mt-1 text-sm text-muted">{project.role}</p>}
        </div>
        <ArrowUpRight
          size={22}
          className="mt-1 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-heading"
        />
      </div>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-[0.1em] text-muted">
          {tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
    </motion.article>
  )
}

/** /projects — the full "See all projects" listing (same item design as home). */
export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true
    fetchProjects()
      .then((d) => alive && setProjects(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const onOpen = (p) => navigate(`/work/${p.id}`)

  return (
    <div className="pt-36 sm:pt-44">
      <div className="container-px">
        <SectionLabel num="01">Projects</SectionLabel>
        <SplitTextReveal
          as="h1"
          text="Selected work & case studies."
          amount={0.4}
          className="max-w-3xl font-heading text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-heading"
        />
        <p className="mt-6 max-w-[55ch] text-base leading-[1.7] text-body">
          A selection of products I've designed, built and shipped — click any one for the full case study.
        </p>

        {loading ? (
          <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] w-full rounded-[4px] border border-line bg-white/[0.03]" />
                <div className="mt-5 h-5 w-1/2 rounded bg-white/[0.05]" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <p className="mt-16 text-muted">No projects published yet — check back soon.</p>
        ) : (
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            animate="show"
            className="mt-16 grid gap-x-8 gap-y-16 pb-8 sm:grid-cols-2"
          >
            {projects.map((p, i) => (
              <Tile key={p.id} project={p} index={i} onOpen={onOpen} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
