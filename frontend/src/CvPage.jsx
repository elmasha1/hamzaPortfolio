import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Phone, Globe } from 'lucide-react'
import Button from './components/ui/Button'
import { Mail, Github, Linkedin, MapPin, Download, ArrowLeft } from './components/ui/Icons'
import { fetchCv } from './lib/api'
import useCvDownload from './hooks/useCvDownload'

const cleanUrl = (u) => (u ? String(u).replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '') : '')
const initials = (name) =>
  (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

const rise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }

/* Section heading inside the paper. */
function Heading({ children }) {
  return (
    <h2 className="mb-3 border-b border-neutral-300 pb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-neutral-900">
      {children}
    </h2>
  )
}

/* Experience / education entry with bullet lines. */
function Entry({ title, subtitle, dates, link, description, tech }) {
  const bullets = String(description || '').split('\n').map((s) => s.trim()).filter(Boolean)
  return (
    <motion.div variants={rise} className="mb-5 last:mb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className="text-[15px] font-semibold text-neutral-900">{title}</h3>
        {dates && <span className="text-xs text-neutral-500">{dates}</span>}
        {link && (
          <a href={link} target="_blank" rel="noreferrer" className="text-xs text-neutral-500 underline-offset-2 hover:text-neutral-900 hover:underline">
            {cleanUrl(link)}
          </a>
        )}
      </div>
      {subtitle && <p className="mt-0.5 text-[13px] italic text-neutral-600">{subtitle}</p>}
      {bullets.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {bullets.map((b, i) => (
            <li key={i} className="flex gap-2 text-[13px] leading-[1.5] text-neutral-700">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-900" />
              {b}
            </li>
          ))}
        </ul>
      )}
      {tech && <p className="mt-1 text-xs italic text-neutral-500">{tech}</p>}
    </motion.div>
  )
}

export default function CvPage() {
  const [cv, setCv] = useState(null)
  const [status, setStatus] = useState('loading')
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
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }
  if (status === 'error' || !cv) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink text-center">
        <p className="text-body">Could not load the CV right now.</p>
        <Link to="/" className="text-sm font-medium text-heading hover:underline">← Back to site</Link>
      </div>
    )
  }

  const groups = Array.isArray(cv.skill_groups) && cv.skill_groups.length ? cv.skill_groups : null
  const contact = [
    cv.email && { Icon: Mail, label: cv.email, href: `mailto:${cv.email}` },
    cv.phone && { Icon: Phone, label: cv.phone, href: `tel:${cv.phone}` },
    cv.location && { Icon: MapPin, label: cv.location },
    cv.website && { Icon: Globe, label: cleanUrl(cv.website), href: cv.website },
    cv.github && { Icon: Github, label: cleanUrl(cv.github), href: cv.github },
    cv.linkedin && { Icon: Linkedin, label: cleanUrl(cv.linkedin), href: cv.linkedin },
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-ink px-4 py-8 sm:px-6 sm:py-12">
      {/* Toolbar */}
      <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-body transition-colors hover:text-heading">
          <ArrowLeft size={16} /> Back to site
        </Link>
        <Button variant="secondary" onClick={download} disabled={loading} className="px-5 py-2.5 text-sm disabled:opacity-70">
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Download size={18} />
          )}
          {loading ? 'Preparing…' : 'Download PDF'}
        </Button>
      </div>

      {/* A4 paper */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-3xl rounded-[6px] bg-white p-8 text-neutral-800 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-12"
      >
        {/* Header */}
        <motion.header variants={stagger} initial="hidden" animate="show" className="flex items-start justify-between gap-6">
          <div>
            <motion.h1 variants={rise} className="font-heading text-[28px] font-bold leading-tight tracking-tight text-neutral-900 sm:text-[34px]">
              {cv.name}
            </motion.h1>
            {cv.role && (
              <motion.p variants={rise} className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
                {cv.role}
              </motion.p>
            )}
            {cv.tagline && (
              <motion.p variants={rise} className="mt-3 max-w-md text-[13px] leading-[1.6] text-neutral-600">
                {cv.tagline}
              </motion.p>
            )}
          </div>

          {/* Photo (rounded-square) */}
          <motion.div variants={rise} className="shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 sm:h-28 sm:w-28">
              {/* REPLACE WITH YOUR PHOTO: /assets/cv-photo.jpg (or set profile_photo in the dashboard) */}
              {photoError || !cv.photo ? (
                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-neutral-400">
                  {initials(cv.name) || 'CV'}
                </div>
              ) : (
                <img
                  src={cv.photo}
                  alt={`Portrait of ${cv.name}`}
                  width="112"
                  height="112"
                  loading="lazy"
                  decoding="async"
                  onError={() => setPhotoError(true)}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </motion.div>
        </motion.header>

        {/* Contact row */}
        {contact.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-neutral-900 pt-3 text-[12.5px] text-neutral-700">
            {contact.map(({ Icon, label, href }) =>
              href ? (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-neutral-900">
                  <Icon size={13} className="text-neutral-500" /> {label}
                </a>
              ) : (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <Icon size={13} className="text-neutral-500" /> {label}
                </span>
              )
            )}
          </div>
        )}

        {/* Body: sidebar + main */}
        <div className="mt-8 grid gap-8 sm:grid-cols-[0.85fr_1.6fr] sm:gap-10">
          {/* Sidebar */}
          <motion.aside variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-7">
            <motion.section variants={rise}>
              <Heading>Skills</Heading>
              {groups ? (
                <div className="space-y-3">
                  {groups.map((g) => (
                    <div key={g.label}>
                      <p className="text-[12.5px] font-semibold text-neutral-900">{g.label}</p>
                      <p className="mt-0.5 text-[12.5px] leading-[1.5] text-neutral-600">{(g.items || []).join(', ')}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12.5px] leading-[1.5] text-neutral-600">{(cv.skills || []).join(', ')}</p>
              )}
            </motion.section>

            {Array.isArray(cv.languages) && cv.languages.length > 0 && (
              <motion.section variants={rise}>
                <Heading>Languages</Heading>
                <ul className="space-y-1.5">
                  {cv.languages.map((l) => (
                    <li key={l.name} className="flex items-baseline justify-between text-[12.5px]">
                      <span className="text-neutral-900">{l.name}</span>
                      <span className="text-neutral-500">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}

            {Array.isArray(cv.certifications) && cv.certifications.length > 0 && (
              <motion.section variants={rise}>
                <Heading>Certifications</Heading>
                <ul className="space-y-1.5 text-[12.5px] text-neutral-700">
                  {cv.certifications.map((c, i) => (
                    <li key={i}>
                      <span className="font-medium text-neutral-900">{c.name}</span>
                      {(c.issuer || c.year) && <span className="text-neutral-500"> · {[c.issuer, c.year].filter(Boolean).join(' · ')}</span>}
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}
          </motion.aside>

          {/* Main */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-7">
            {cv.summary && (
              <motion.section variants={rise}>
                <Heading>Profile</Heading>
                <p className="text-[13px] leading-[1.6] text-neutral-700">{cv.summary}</p>
              </motion.section>
            )}

            {Array.isArray(cv.experiences) && cv.experiences.length > 0 && (
              <section>
                <Heading>Experience</Heading>
                {cv.experiences.map((e, i) => (
                  <Entry key={i} title={e.title} subtitle={e.company} dates={[e.start, e.end].filter(Boolean).join(' – ')} description={e.description} />
                ))}
              </section>
            )}

            {Array.isArray(cv.projects) && cv.projects.length > 0 && (
              <section>
                <Heading>Key Projects</Heading>
                {cv.projects.map((p, i) => (
                  <Entry key={i} title={p.name} link={p.link} description={p.description} tech={p.tech} />
                ))}
              </section>
            )}

            {Array.isArray(cv.education) && cv.education.length > 0 && (
              <section>
                <Heading>Education</Heading>
                {cv.education.map((ed, i) => (
                  <Entry key={i} title={ed.degree} subtitle={ed.school} dates={[ed.start, ed.end].filter(Boolean).join(' – ')} description={ed.description} />
                ))}
              </section>
            )}
          </motion.div>
        </div>
      </motion.article>
    </div>
  )
}
