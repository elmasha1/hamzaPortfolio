import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { fetchProjects } from '../lib/api'
import { staggerContainer, fadeUp, viewportOnce } from '../lib/motion'
import { useReducedEffects } from '../hooks/usePerf'
import SectionLabel from './ui/SectionLabel'
import SplitTextReveal from './ui/SplitTextReveal'
import Meta from './ui/Meta'
import WorkPreview from './WorkPreview'
import { ArrowUpRight } from './ui/Icons'

const FALLBACK = [
  {
    id: 1,
    title: 'Atlas',
    problem: 'Dispatchers were coordinating hundreds of daily freight loads in spreadsheets. Built the ops platform that replaced them.',
    role: 'Sole engineer',
    tech_tags: ['React', 'Laravel', 'Postgres', 'Docker'],
    image: '',
  },
  {
    id: 2,
    title: 'Ledger',
    problem: 'Small studios lost six hours a week to manual invoicing. Designed and shipped the billing product they now bill from.',
    role: 'Product + build',
    tech_tags: ['React', 'Laravel', 'Stripe'],
    image: '',
  },
  {
    id: 3,
    title: 'Pulse',
    problem: 'A client found out about outages from their customers. Built the alerting and status layer that tells them first.',
    role: 'Backend lead',
    tech_tags: ['Laravel', 'Redis', 'Docker'],
    image: '',
  },
]

/* "Sole engineer · React · Laravel · Postgres" — role folds into the stack. */
function metaLine(project) {
  const tags = Array.isArray(project.tech_tags) ? project.tech_tags : []
  return [project.role, ...tags].filter(Boolean).join(' · ')
}

/**
 * A single index row. It is a real <Link>, so the preview panel responds to
 * keyboard focus exactly as it does to hover — the colour reward is not
 * mouse-only.
 */
function Row({ project, index, onActivate }) {
  const outcome = project.outcome_metric
  const problem = project.problem || project.description

  return (
    <m.div variants={fadeUp(20)}>
      <Link
        to={`/work/${project.id}`}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        data-cursor="view"
        className="row group block px-2 py-6 sm:py-7"
      >
        <div className="flex items-baseline gap-4 sm:gap-5">
          <Meta className="w-6 shrink-0 pt-1">{String(index + 1).padStart(2, '0')}</Meta>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
              <h3 className="font-heading text-h3 font-medium text-ink-300 transition-colors duration-300 group-hover:text-ink-100 group-focus-visible:text-ink-100">
                {project.title}
              </h3>
              {outcome && (
                <Meta tone="ink" className="whitespace-nowrap font-medium">
                  {outcome} <span aria-hidden="true">↗</span>
                </Meta>
              )}
            </div>

            {problem && (
              <p className="mt-2 max-w-[52ch] text-small text-ink-300">{problem}</p>
            )}

            <div className="mt-3 flex items-end justify-between gap-4">
              <Meta caps className="tracking-[0.05em]">
                {metaLine(project)}
              </Meta>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-ink-500 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
              />
            </div>
          </div>
        </div>

        {/* Below lg each row carries its own image instead of the sticky
            panel. It hangs off the row itself, not the indented text column,
            so the bleed cancels the row padding plus the container gutter and
            lands flush on BOTH edges. */}
        {project.image && (
          <div className="-mx-7 mt-6 aspect-video overflow-hidden border-y border-rule-soft bg-paper-2 sm:-mx-10 lg:hidden">
            <img
              src={project.image}
              alt={`${project.title} — preview`}
              loading="lazy"
              decoding="async"
              width="1200"
              height="675"
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </Link>
    </m.div>
  )
}

/**
 * WorkIndex — selected work as a vertical editorial index with a sticky
 * colour preview.
 *
 * Replaces the GSAP-pinned horizontal gallery: every project now carries the
 * four things a hiring manager scans for — problem, role, stack, outcome — the
 * project count is visible, the section reads top-to-bottom in a few seconds,
 * and touch gets the same layout instead of a second implementation.
 */
export default function WorkIndex({ scope = 'Home', index = '02' }) {
  const [projects, setProjects] = useState([])
  const [active, setActive] = useState(0)
  const reduce = useReducedEffects()

  useEffect(() => {
    let alive = true
    fetchProjects()
      .then((d) => alive && setProjects(Array.isArray(d) && d.length ? d : FALLBACK))
      .catch(() => alive && setProjects(FALLBACK))
    return () => {
      alive = false
    }
  }, [])

  // A row with no image doesn't blank the panel — it holds the last preview.
  const previewIndex = useMemo(() => {
    if (projects[active]?.image) return active
    for (let i = active; i >= 0; i--) if (projects[i]?.image) return i
    return active
  }, [projects, active])

  if (projects.length === 0) return null

  const activeProject = projects[active] || projects[0]

  return (
    <section id="projects" className="section-y relative">
      <div className="container-px">
        <m.div
          variants={staggerContainer()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <SectionLabel scope={scope} index={index}>
            Selected work
          </SectionLabel>

          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <SplitTextReveal
              as="h2"
              text="Products, still running."
              amount={0.4}
              className="max-w-[22ch] font-heading text-h2 font-semibold text-ink-100"
            />
            <Meta caps className="tracking-[0.05em] sm:text-right">
              {String(projects.length).padStart(2, '0')} selected
            </Meta>
          </div>
        </m.div>

        <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* The index */}
          <m.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="border-t border-rule lg:col-span-7"
          >
            {projects.map((p, i) => (
              <Row key={p.id ?? i} project={p} index={i} onActivate={() => setActive(i)} />
            ))}
          </m.div>

          {/* The sticky colour preview — desktop only */}
          <div className="hidden lg:col-span-5 lg:block">
            <WorkPreview
              projects={projects}
              active={previewIndex}
              meta={metaLine(activeProject) || activeProject.title}
              reduce={reduce}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
