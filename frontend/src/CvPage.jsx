import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'
import Starfield from './components/Starfield'
import CosmicDecor from './components/CosmicDecor'
import Button from './components/ui/Button'
import { Mail, Github, MapPin, Download, ArrowLeft } from './components/ui/Icons'
import { staggerContainer, fadeUp, viewportOnce } from './lib/motion'
import { fetchCv } from './lib/api'
import useCvDownload from './hooks/useCvDownload'

const cleanUrl = (u) => (u ? String(u).replace(/^https?:\/\//, '').replace(/\/$/, '') : '')

/* Wide-tracked uppercase section label (luxury small-caps). */
function Label({ children }) {
  return <motion.p variants={fadeUp(16)} className="eyebrow mb-4">{children}</motion.p>
}

/* A single experience / education entry on a thin blue timeline. */
function TimelineItem({ title, subtitle, dates, description }) {
  const bullets = String(description || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    <motion.div variants={fadeUp(20)} className="relative border-l border-primary/30 pl-6 pb-7 last:pb-0">
      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className="font-heading text-base font-semibold text-heading">{title}</h3>
        {dates && <span className="text-xs font-medium text-muted">{dates}</span>}
      </div>
      {subtitle && <p className="mt-0.5 text-sm font-medium text-primary">{subtitle}</p>}
      {bullets.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-body">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
              {b}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

export default function CvPage() {
  const [cv, setCv] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ok | error
  const [photoError, setPhotoError] = useState(false)
  const { download, loading } = useCvDownload(cv)

  useEffect(() => {
    let alive = true
    fetchCv()
      .then((data) => {
        if (!alive) return
        setCv(data)
        setStatus('ok')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    document.title = cv?.name ? `${cv.name} — CV` : 'CV'
  }, [cv])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (status === 'error' || !cv) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <p className="text-body">Could not load the CV right now.</p>
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          ← Back to site
        </Link>
      </div>
    )
  }

  const contact = [
    cv.email && { Icon: Mail, label: cv.email, href: `mailto:${cv.email}` },
    cv.github && { Icon: Github, label: cleanUrl(cv.github), href: cv.github },
    cv.location && { Icon: MapPin, label: cv.location },
  ].filter(Boolean)

  return (
    <div className="relative min-h-screen">
      <Starfield />
      <CosmicDecor />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        {/* Top bar */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-body transition-colors hover:text-heading"
          >
            <ArrowLeft size={16} /> Back to site
          </Link>
          <Button
            variant="secondary"
            onClick={download}
            disabled={loading}
            className="px-5 py-2.5 text-sm disabled:opacity-70"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-heading/30 border-t-heading" />
            ) : (
              <Download size={18} />
            )}
            {loading ? 'Preparing…' : 'Download PDF'}
          </Button>
        </div>

        {/* Header */}
        <motion.header
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-6 rounded-3xl border border-line bg-white/[0.04] p-8 text-center shadow-soft backdrop-blur-xl sm:flex-row sm:items-center sm:text-left"
        >
          {/* Photo — gradient ring + blue glow */}
          <motion.div variants={fadeUp(18)} className="shrink-0">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary via-primary/30 to-transparent p-[3px] shadow-[0_0_40px_rgba(59,130,246,0.35)]">
              <div className="h-full w-full overflow-hidden rounded-full bg-base-indigo">
                {photoError || !cv.photo ? (
                  <div className="flex h-full w-full items-center justify-center bg-base-indigo text-primary">
                    <Code2 size={48} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                ) : (
                  <img
                    src={cv.photo}
                    alt={`Portrait of ${cv.name}`}
                    width="128"
                    height="128"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    onError={() => setPhotoError(true)}
                  />
                )}
              </div>
            </div>
          </motion.div>

          <div>
            {cv.role && (
              <motion.p variants={fadeUp(16)} className="eyebrow mb-2">
                {cv.role}
              </motion.p>
            )}
            <motion.h1
              variants={fadeUp(20)}
              className="font-heading text-3xl font-semibold tracking-tight text-heading sm:text-4xl"
            >
              {cv.name}
            </motion.h1>
            <motion.div
              variants={fadeUp(16)}
              className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start"
            >
              {contact.map(({ Icon, label, href }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-body transition-colors hover:text-primary"
                  >
                    <Icon size={15} className="text-primary" /> {label}
                  </a>
                ) : (
                  <span key={label} className="inline-flex items-center gap-1.5 text-sm text-body">
                    <Icon size={15} className="text-primary" /> {label}
                  </span>
                )
              )}
            </motion.div>
          </div>
        </motion.header>

        {/* Body */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          {/* LEFT */}
          <div className="space-y-12">
            {cv.summary && (
              <motion.section
                variants={staggerContainer(0.08)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <Label>Profile</Label>
                <motion.p variants={fadeUp(18)} className="text-body">
                  {cv.summary}
                </motion.p>
              </motion.section>
            )}

            {Array.isArray(cv.experiences) && cv.experiences.length > 0 && (
              <motion.section
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <Label>Experience</Label>
                <div>
                  {cv.experiences.map((e, i) => (
                    <TimelineItem
                      key={i}
                      title={e.title}
                      subtitle={[e.company].filter(Boolean).join('')}
                      dates={[e.start, e.end].filter(Boolean).join(' – ')}
                      description={e.description}
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* RIGHT */}
          <div className="space-y-12">
            {Array.isArray(cv.skills) && cv.skills.length > 0 && (
              <motion.section
                variants={staggerContainer(0.05)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <Label>Skills</Label>
                <motion.div variants={fadeUp(16)} className="flex flex-wrap gap-2">
                  {cv.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line bg-[#0B1A33] px-3 py-1 text-xs font-medium text-primary-300"
                    >
                      {s}
                    </span>
                  ))}
                </motion.div>
              </motion.section>
            )}

            {Array.isArray(cv.education) && cv.education.length > 0 && (
              <motion.section
                variants={staggerContainer(0.08)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <Label>Education</Label>
                <div>
                  {cv.education.map((ed, i) => (
                    <TimelineItem
                      key={i}
                      title={ed.degree}
                      subtitle={ed.school}
                      dates={[ed.start, ed.end].filter(Boolean).join(' – ')}
                      description={ed.description}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {Array.isArray(cv.languages) && cv.languages.length > 0 && (
              <motion.section
                variants={staggerContainer(0.06)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <Label>Languages</Label>
                <motion.ul variants={fadeUp(16)} className="space-y-2">
                  {cv.languages.map((l) => (
                    <li key={l.name} className="flex items-center justify-between text-sm">
                      <span className="text-heading">{l.name}</span>
                      <span className="text-muted">{l.level}</span>
                    </li>
                  ))}
                </motion.ul>
              </motion.section>
            )}

            {Array.isArray(cv.certifications) && cv.certifications.length > 0 && (
              <motion.section
                variants={staggerContainer(0.06)}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
              >
                <Label>Certifications</Label>
                <motion.ul variants={fadeUp(16)} className="space-y-2 text-sm text-body">
                  {cv.certifications.map((c, i) => (
                    <li key={i}>
                      <span className="font-medium text-heading">{c.name}</span>
                      {(c.issuer || c.year) && (
                        <span className="text-muted"> · {[c.issuer, c.year].filter(Boolean).join(' · ')}</span>
                      )}
                    </li>
                  ))}
                </motion.ul>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
