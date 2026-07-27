import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { m } from 'framer-motion'
import SplitTextReveal from './components/ui/SplitTextReveal'
import Meta from './components/ui/Meta'
import CaseStudyRail from './components/CaseStudyRail'
import { ArrowLeft, ArrowUpRight, Github, ExternalLink } from './components/ui/Icons'
import { fetchProject, fetchProjects } from './lib/api'

/* Deliberately unfinished-looking, like the work index — never a fake image. */
function NoImage({ title }) {
  return (
    <div
      className="flex aspect-[21/9] w-full items-center justify-center bg-paper-2"
      style={{
        backgroundImage:
          'repeating-linear-gradient(135deg, rgba(255,255,255,.05) 0 1px, transparent 1px 10px)',
      }}
    >
      <div className="px-6 text-center">
        <Meta caps className="block tracking-[0.08em]">
          No preview
        </Meta>
        <Meta className="mt-2 block text-ink-700">{title}</Meta>
      </div>
    </div>
  )
}

/**
 * SpecTable — the datasheet under the title. Reads like a spec sheet, scans in
 * three seconds, and every row disappears when the dashboard hasn't filled it.
 */
function SpecTable({ project }) {
  const stack = Array.isArray(project.tech_tags) ? project.tech_tags : []
  const rows = [
    ['Role', project.role],
    ['Year', project.year],
    ['Stack', stack.length ? stack.join(' · ') : ''],
    ['Team size', project.team_size],
    ['Status', project.status],
  ].filter(([, value]) => value)

  const links = [
    project.live_url && { label: 'Live', href: project.live_url, Icon: ExternalLink },
    project.github_url && { label: 'Repo', href: project.github_url, Icon: Github },
  ].filter(Boolean)

  if (rows.length === 0 && links.length === 0) return null

  return (
    <dl className="mt-12 border-t border-rule">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-rule-soft py-3.5 sm:grid-cols-[10rem_1fr]"
        >
          <Meta caps as="dt" className="tracking-[0.06em]">
            {label}
          </Meta>
          <Meta as="dd" tone="body" className="uppercase tracking-[0.05em]">
            {value}
          </Meta>
        </div>
      ))}
      {links.length > 0 && (
        <div className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-rule-soft py-3.5 sm:grid-cols-[10rem_1fr]">
          <Meta caps as="dt" className="tracking-[0.06em]">
            Links
          </Meta>
          <dd className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-b border-rule pb-0.5 font-mono text-meta uppercase tracking-[0.05em] text-ink-300 transition-colors hover:border-ink-100 hover:text-ink-100"
              >
                <l.Icon size={14} />
                {l.label}
              </a>
            ))}
          </dd>
        </div>
      )}
    </dl>
  )
}

/* A numbered case-study block. Renders nothing without content. */
function Block({ id, number, label, children }) {
  if (!children) return null
  return (
    <section
      id={id}
      className="grid gap-y-4 border-t border-rule py-10 md:grid-cols-[0.4fr_1fr] md:gap-x-10 lg:py-12"
    >
      <h2 className="flex items-baseline gap-4">
        <Meta aria-hidden="true">{number}</Meta>
        <Meta caps tone="body" className="tracking-[0.06em]">
          {label}
        </Meta>
      </h2>
      <div className="max-w-[62ch] text-ink-300">{children}</div>
    </section>
  )
}

/**
 * ArchitectureDiagram — the stack as hairline columns, built from the
 * dashboard's `architecture` metadata. Boxes and rules only: no illustration
 * to keep in sync with reality.
 */
function ArchitectureDiagram({ layers }) {
  if (!layers.length) return null
  return (
    <div className="grid gap-px bg-rule-soft sm:grid-cols-2 xl:grid-cols-3">
      {layers.map((layer, i) => (
        <div key={layer.layer || i} className="bg-paper p-5">
          <Meta caps className="block tracking-[0.06em]">
            {layer.layer}
          </Meta>
          <ul className="mt-3 space-y-1 font-mono text-[0.8125rem] leading-[1.9] text-ink-300">
            {(Array.isArray(layer.items) ? layer.items : []).map((item) => (
              <li key={item}>
                <span aria-hidden="true" className="mr-2 text-ink-700">
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [status, setStatus] = useState('loading')
  const [siblings, setSiblings] = useState([])

  useEffect(() => {
    let alive = true
    setStatus('loading')
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

  // The next-project row mirrors the work index. Cached by lib/api, so this
  // costs nothing when the visitor arrived from the home page.
  useEffect(() => {
    let alive = true
    fetchProjects()
      .then((d) => alive && setSiblings(Array.isArray(d) ? d : []))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const next = useMemo(() => {
    if (!p || siblings.length < 2) return null
    const i = siblings.findIndex((s) => String(s.id) === String(p.id))
    if (i === -1) return null
    return siblings[(i + 1) % siblings.length]
  }, [p, siblings])

  // Up to three result figures, split from the dashboard's outcome figure.
  const figures = String(p?.outcome_metric || '')
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)

  const architecture = Array.isArray(p?.architecture) ? p.architecture.filter((l) => l?.layer) : []
  const features = Array.isArray(p?.key_features) ? p.key_features.filter(Boolean) : []

  // The rail lists only the blocks that actually rendered.
  const blocks = p
    ? [
        p.description && { id: 'context', number: '01', label: 'Context' },
        (p.problem || p.challenges) && { id: 'challenge', number: '02', label: 'Challenge' },
        p.architecture_notes && { id: 'approach', number: '03', label: 'Approach' },
        architecture.length > 0 && { id: 'architecture', number: '04', label: 'Architecture' },
        features.length > 0 && { id: 'build', number: '05', label: 'Build' },
        (p.outcome || figures.length > 0) && { id: 'result', number: '06', label: 'Result' },
        next && { id: 'next', number: '07', label: 'Next' },
      ].filter(Boolean)
    : []

  return (
    <div className="relative min-h-screen">
      {/* Clip-wipe arrival transition */}
      <m.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] bg-paper"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        style={{ transformOrigin: 'top' }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      />

      <div className="container-px relative z-10 pt-28 lg:pt-32">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 font-mono text-meta uppercase tracking-[0.06em] text-ink-500 transition-colors hover:text-ink-100"
        >
          <ArrowLeft size={14} /> Back to work
        </Link>

        {status === 'error' && (
          <p className="mt-20 text-center text-ink-300">Project not found.</p>
        )}

        {status === 'loading' && (
          <div className="mt-16 aspect-[21/9] w-full animate-pulse border border-rule bg-white/[0.03]" />
        )}
      </div>

      {status === 'ok' && p && (
        <article className="relative z-10">
          <div className="container-px">
            <SplitTextReveal
              as="h1"
              text={p.title}
              delay={0.45}
              amount={0.2}
              className="mt-10 max-w-[18ch] font-heading text-h1 font-semibold text-ink-100"
            />
            <SpecTable project={p} />
          </div>

          {/* Full-bleed, full colour — the case study is where colour lives. */}
          <m.div
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.6 }}
            className="mt-14 border-y border-rule lg:mt-16"
          >
            {p.image ? (
              <img
                src={p.image}
                alt={`${p.title} — product screen`}
                loading="eager"
                decoding="async"
                width="2400"
                height="1029"
                className="aspect-[21/9] w-full object-cover"
              />
            ) : (
              <NoImage title={p.title} />
            )}
          </m.div>

          <div className="container-px mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-3">
              <CaseStudyRail blocks={blocks} />
            </div>

            <div className="lg:col-span-9">
              <Block id="context" number="01" label="Context">
                {p.description && (
                  <p className="whitespace-pre-line text-lead leading-[1.6]">{p.description}</p>
                )}
              </Block>

              <Block id="challenge" number="02" label="Challenge">
                {(p.problem || p.challenges) && (
                  <div className="space-y-5">
                    {p.problem && <p className="whitespace-pre-line">{p.problem}</p>}
                    {p.challenges && (
                      <p className="whitespace-pre-line text-small text-ink-500">{p.challenges}</p>
                    )}
                  </div>
                )}
              </Block>

              <Block id="approach" number="03" label="Approach">
                {p.architecture_notes && (
                  <p className="whitespace-pre-line">{p.architecture_notes}</p>
                )}
              </Block>

              <Block id="architecture" number="04" label="Architecture">
                {architecture.length > 0 && <ArchitectureDiagram layers={architecture} />}
              </Block>

              <Block id="build" number="05" label="Build">
                {features.length > 0 && (
                  <ul className="grid gap-px bg-rule-soft sm:grid-cols-2">
                    {features.map((f) => (
                      <li key={f} className="bg-paper py-3 pr-4 text-small text-ink-300 sm:px-4">
                        <span aria-hidden="true" className="mr-2 text-ink-700">
                          →
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </Block>

              <Block id="result" number="06" label="Result">
                {(p.outcome || figures.length > 0) && (
                  <div>
                    {figures.length > 0 && (
                      <div className="mb-8 grid gap-px bg-rule-soft sm:grid-cols-3">
                        {figures.map((f) => (
                          <div key={f} className="bg-paper py-4 sm:px-4 sm:first:pl-0">
                            <span className="font-heading text-h2 font-semibold text-ink-100">
                              {f}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {p.outcome && <p className="whitespace-pre-line">{p.outcome}</p>}
                  </div>
                )}
              </Block>
            </div>
          </div>

          {/* Next project — mirrors a work-index row, full-bleed. */}
          {next && (
            <section id="next" className="mt-20 border-t border-rule lg:mt-24">
              <Link
                to={`/work/${next.id}`}
                data-cursor="view"
                className="group block transition-colors duration-300 hover:bg-white/[0.04]"
              >
                <div className="container-px flex flex-col gap-6 py-12 lg:flex-row lg:items-end lg:justify-between lg:py-16">
                  <div>
                    <Meta caps className="block tracking-[0.06em]">
                      07 — Next
                    </Meta>
                    <h2 className="mt-4 font-heading text-h2 font-semibold text-ink-300 transition-colors duration-300 group-hover:text-ink-100">
                      {next.title}
                    </h2>
                    {(next.problem || next.description) && (
                      <p className="mt-3 max-w-[52ch] text-small text-ink-500">
                        {next.problem || next.description}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight
                    size={28}
                    className="shrink-0 text-ink-500 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
              </Link>
            </section>
          )}
        </article>
      )}
    </div>
  )
}
