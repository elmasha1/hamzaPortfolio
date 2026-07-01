import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fetchProjects } from '../lib/api'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import { useReducedEffects } from '../hooks/usePerf'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import { ArrowRight, ArrowUpRight } from './ui/Icons'

const FALLBACK = [
  { id: 1, title: 'Atlas — SaaS Platform', role: 'Lead full-stack', tech_tags: ['React', 'Laravel', 'MySQL'], image: '' },
  { id: 2, title: 'Ledger — Payments API', role: 'Backend engineer', tech_tags: ['Laravel', 'REST'], image: '' },
  { id: 3, title: 'Pulse — Realtime Dashboard', role: 'Full-stack', tech_tags: ['React', 'WebSockets'], image: '' },
]

const placeholder = (title) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#141414'/><text x='50%' y='50%' fill='#666' font-family='Space Grotesk,Inter,sans-serif' font-size='28' text-anchor='middle' dominant-baseline='middle'>${title}</text></svg>`
  )

/* A single work tile — masked image + editorial meta. */
function Tile({ project, index, onOpen, horizontal }) {
  const tags = Array.isArray(project.tech_tags) ? project.tech_tags : []
  return (
    <motion.article
      {...(horizontal
        ? {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.25 },
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }
        : { variants: fadeUp(28) })}
      data-cursor="view"
      onClick={() => onOpen(project)}
      className={`group shrink-0 cursor-pointer ${horizontal ? 'w-[80vw] sm:w-[52vw] lg:w-[38vw]' : 'w-full'}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[4px] border border-line bg-base-indigo">
        {/* clip-path/mask wipe as the card enters view */}
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

export default function WorkGallery() {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()
  const reduced = useReducedEffects() // touch / reduced-motion / low-end → vertical
  const pinRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    let alive = true
    fetchProjects()
      .then((d) => alive && setProjects(Array.isArray(d) && d.length ? d : FALLBACK))
      .catch(() => alive && setProjects(FALLBACK))
    return () => {
      alive = false
    }
  }, [])

  // Horizontal pinned scroll (desktop, motion-OK only).
  useLayoutEffect(() => {
    if (reduced || projects.length === 0) return
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, pinRef)
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 400)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [reduced, projects])

  const onOpen = (p) => navigate(`/work/${p.id}`)

  return (
    <section id="projects" className="relative">
      {/* Header */}
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="container-px pb-12 pt-24"
      >
        <SectionLabel num="03">Selected work</SectionLabel>
        <SplitTextReveal
          as="h2"
          text="Engineering case studies — real products, real outcomes."
          amount={0.4}
          className="max-w-3xl font-heading text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-heading"
        />
      </motion.div>

      {reduced ? (
        // Vertical fallback (mobile / reduced motion / low-end).
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="container-px grid gap-14 pb-12 sm:grid-cols-2"
        >
          {projects.map((p, i) => (
            <Tile key={p.id} project={p} index={i} onOpen={onOpen} horizontal={false} />
          ))}
        </motion.div>
      ) : (
        // Pinned horizontal gallery.
        <div ref={pinRef} className="relative h-screen overflow-hidden">
          <div
            ref={trackRef}
            data-cursor="drag"
            className="flex h-full items-center gap-[6vw] px-[8vw] will-change-transform"
          >
            {projects.map((p, i) => (
              <Tile key={p.id} project={p} index={i} onOpen={onOpen} horizontal />
            ))}
            {/* End CTA panel */}
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault()
                navigate('/contact')
              }}
              className="group flex w-[70vw] shrink-0 flex-col justify-center sm:w-[40vw]"
            >
              <span className="eyebrow mb-4">Next</span>
              <span className="font-heading text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-heading">
                Let&rsquo;s work
                <br />
                together
              </span>
              <span className="mt-6 inline-flex items-center gap-2 text-muted transition-colors group-hover:text-heading">
                Start a project <ArrowRight size={18} />
              </span>
            </a>
          </div>
        </div>
      )}
    </section>
  )
}
