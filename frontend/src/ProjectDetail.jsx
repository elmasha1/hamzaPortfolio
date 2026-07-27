import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Cursor from './components/Cursor'
import GrainOverlay from './components/GrainOverlay'
import SplitTextReveal from './components/ui/SplitTextReveal'
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, Check } from './components/ui/Icons'
import { fetchProject } from './lib/api'

const placeholder = (title) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'><rect width='100%' height='100%' fill='#141414'/><text x='50%' y='50%' fill='#666' font-family='Space Grotesk,Inter,sans-serif' font-size='34' text-anchor='middle' dominant-baseline='middle'>${title}</text></svg>`
  )

/* A labelled case-study block. */
function Block({ index, label, children }) {
  if (!children) return null
  return (
    <div className="grid gap-4 border-t border-rule py-10 md:grid-cols-[0.4fr_1fr]">
      <div className="flex items-start gap-3">
        <span className="font-heading text-xs text-ink-500">{index}</span>
        <span className="eyebrow">{label}</span>
      </div>
      <div className="max-w-2xl whitespace-pre-line text-lg leading-relaxed text-ink-300">
        {children}
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    window.scrollTo(0, 0)
    let alive = true
    fetchProject(id)
      .then((data) => {
        if (!alive) return
        setP(data)
        setStatus('ok')
        document.title = `${data.title} — Case study`
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [id])

  return (
    <div className="relative min-h-screen">
      <Cursor />
      <GrainOverlay />

      {/* Clip-wipe arrival transition */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] bg-paper"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        style={{ transformOrigin: 'top' }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      />

      <div className="container-px relative z-10 pb-28 pt-28">
        <Link
          to="/"
          data-cursor="hover"
          className="inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-ink-100"
        >
          <ArrowLeft size={16} /> Back to work
        </Link>

        {status === 'error' && (
          <p className="mt-20 text-center text-ink-300">Project not found.</p>
        )}

        {status === 'loading' && (
          <div className="mt-16 h-[60vh] w-full animate-pulse rounded-[4px] bg-white/[0.04]" />
        )}

        {status === 'ok' && p && (
          <article className="mt-12">
            {/* Title */}
            <SplitTextReveal
              as="h1"
              text={p.title}
              delay={0.5}
              amount={0.2}
              className="max-w-5xl font-heading text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink-100"
            />

            {/* Meta row */}
            <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4 border-y border-rule py-5 text-sm">
              {p.role && (
                <div>
                  <span className="eyebrow block">Role</span>
                  <span className="mt-1 block text-ink-300">{p.role}</span>
                </div>
              )}
              {Array.isArray(p.tech_tags) && p.tech_tags.length > 0 && (
                <div>
                  <span className="eyebrow block">Stack</span>
                  <span className="mt-1 block text-ink-300">{p.tech_tags.join(', ')}</span>
                </div>
              )}
              <div className="ml-auto flex items-end gap-4">
                {p.live_url && (
                  <a href={p.live_url} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-ink-300 transition-colors hover:text-ink-100">
                    <ExternalLink size={16} /> Live
                  </a>
                )}
                {p.github_url && (
                  <a href={p.github_url} target="_blank" rel="noreferrer" data-cursor="hover" className="inline-flex items-center gap-1.5 text-ink-300 transition-colors hover:text-ink-100">
                    <Github size={16} /> GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Hero image — clip reveal */}
            <motion.div
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.75 }}
              className="mt-12 overflow-hidden rounded-[4px] border border-rule bg-paper-2"
            >
              <img
                src={p.image || placeholder(p.title)}
                alt={`${p.title} — screenshot`}
                loading="lazy"
                decoding="async"
                onError={(e) => (e.currentTarget.src = placeholder(p.title))}
                className="aspect-[16/10] w-full object-cover"
              />
            </motion.div>

            {/* Overview */}
            {p.description && (
              <p className="mx-auto mt-16 max-w-3xl text-center font-heading text-2xl font-medium leading-snug text-ink-100 sm:text-3xl">
                {p.description}
              </p>
            )}

            {/* Case study */}
            <div className="mt-16">
              <Block index="01" label="Problem">{p.problem}</Block>
              <Block index="02" label="Approach & Architecture">{p.architecture_notes}</Block>

              {Array.isArray(p.key_features) && p.key_features.length > 0 && (
                <div className="grid gap-4 border-t border-rule py-10 md:grid-cols-[0.4fr_1fr]">
                  <div className="flex items-start gap-3">
                    <span className="font-heading text-xs text-ink-500">03</span>
                    <span className="eyebrow">Key features</span>
                  </div>
                  <ul className="grid max-w-2xl gap-3 sm:grid-cols-2">
                    {p.key_features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-ink-300">
                        <Check size={16} className="mt-1 shrink-0 text-ink-100" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Block index="04" label="Challenges">{p.challenges}</Block>
              <Block index="05" label="Outcome & Impact">{p.outcome}</Block>
            </div>

            {/* Back / next */}
            <div className="mt-16 border-t border-rule pt-10">
              <Link
                to="/"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 font-heading text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-[-0.02em] text-ink-100"
              >
                All projects
                <ArrowUpRight size={32} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}
