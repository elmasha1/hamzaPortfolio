import { useEffect, useState } from 'react'
import { cvApi, cvPhotoApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, Trash2 } from '../../components/ui/Icons'
import ImageUploader from '../components/ImageUploader'

const field =
  'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

const EMPTY = {
  name: '',
  role: '',
  tagline: '',
  email: '',
  phone: '',
  github: '',
  linkedin: '',
  website: '',
  location: '',
  photo: '',
  summary: '',
  experiences: [],
  education: [],
  skills: [],
  skill_groups: [],
  projects: [],
  languages: [],
  certifications: [],
}

function Section({ title, children, action }) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.04] p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-heading">{title}</h3>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Labeled({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      {children}
    </label>
  )
}

/* Generic editor for an array of objects (experiences, education, etc.). */
function RepeatableList({ items, onChange, blank, render, addLabel }) {
  const update = (i, key, value) => {
    const next = [...items]
    next[i] = { ...next[i], [key]: value }
    onChange(next)
  }
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const add = () => onChange([...items, { ...blank }])

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="relative rounded-xl border border-line bg-white/[0.02] p-4">
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="Remove"
            className="absolute right-3 top-3 text-muted transition hover:text-coral"
          >
            <Trash2 size={16} />
          </button>
          <div className="space-y-3 pr-6">{render(item, (key, value) => update(i, key, value))}</div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <Plus size={16} /> {addLabel}
      </button>
    </div>
  )
}

export default function Cv() {
  const toast = useToast()
  const [cv, setCv] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    cvApi
      .get()
      .then((data) => setCv({ ...EMPTY, ...data }))
      .catch(() => toast.error('Could not load the CV.'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setCv((p) => ({ ...p, [k]: v }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Photos are managed by their own uploaders, never by this form.
      const { photo, cv_photo, ...rest } = cv
      const saved = await cvApi.update(rest)
      setCv({ ...EMPTY, ...saved })
      toast.success('CV saved.')
    } catch {
      toast.error('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  if (!cv) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04] shadow-soft" />
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-heading">CV / Resume</h2>
          <p className="mt-1 text-sm text-muted">
            Edits appear on{' '}
            <a href="/cv" target="_blank" rel="noreferrer" className="text-primary hover:underline">/cv</a>{' '}
            and in the downloaded PDF.
          </p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
          <span className="relative z-10 inline-flex items-center gap-2">
            {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />}
            Save changes
          </span>
        </button>
      </div>

      <Section title="Personal info">
        <div className="grid gap-3 sm:grid-cols-2">
          <Labeled label="Full name">
            <input value={cv.name} onChange={(e) => set('name', e.target.value)} className={field} />
          </Labeled>
          <Labeled label="Role / title">
            <input value={cv.role} onChange={(e) => set('role', e.target.value)} className={field} />
          </Labeled>
          <Labeled label="Email">
            <input value={cv.email} onChange={(e) => set('email', e.target.value)} className={field} />
          </Labeled>
          <Labeled label="Phone">
            <input value={cv.phone} onChange={(e) => set('phone', e.target.value)} className={field} placeholder="+212 …" />
          </Labeled>
          <Labeled label="Location">
            <input value={cv.location} onChange={(e) => set('location', e.target.value)} className={field} />
          </Labeled>
          <Labeled label="Website / portfolio URL">
            <input value={cv.website} onChange={(e) => set('website', e.target.value)} className={field} placeholder="https://…" />
          </Labeled>
          <Labeled label="GitHub URL">
            <input value={cv.github} onChange={(e) => set('github', e.target.value)} className={field} />
          </Labeled>
          <Labeled label="LinkedIn URL">
            <input value={cv.linkedin} onChange={(e) => set('linkedin', e.target.value)} className={field} />
          </Labeled>
        </div>
        <Labeled label="Tagline (one line under the name)">
          <input value={cv.tagline} onChange={(e) => set('tagline', e.target.value)} className={field} />
        </Labeled>
      </Section>

      <Section title="CV photo">
        <p className="-mt-1 text-sm text-muted">
          A dedicated (more formal) photo for the CV. If none is set, the CV
          uses your site profile photo, then the initials placeholder.
        </p>
        <ImageUploader
          value={cv.cv_photo || ''}
          alt="CV photo"
          uploadFn={cvPhotoApi.upload}
          onUploaded={(d) => {
            setCv((p) => ({ ...p, cv_photo: d.cv_photo, photo: d.cv_photo }))
            toast.success('CV photo uploaded.')
          }}
          onRemove={async () => {
            try {
              await cvPhotoApi.remove()
              setCv((p) => ({ ...p, cv_photo: '' }))
              toast.success('CV photo removed — the profile photo will be used.')
            } catch {
              toast.error('Could not remove the photo.')
            }
          }}
        />
      </Section>

      <Section title="Profile summary">
        <textarea value={cv.summary} onChange={(e) => set('summary', e.target.value)} rows={4} className={`${field} resize-none`} />
      </Section>

      <Section title="Experience">
        <RepeatableList
          items={cv.experiences}
          onChange={(v) => set('experiences', v)}
          blank={{ title: '', company: '', start: '', end: '', description: '' }}
          addLabel="Add experience"
          render={(item, upd) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={item.title} onChange={(e) => upd('title', e.target.value)} className={field} placeholder="Job title" />
                <input value={item.company} onChange={(e) => upd('company', e.target.value)} className={field} placeholder="Company" />
                <input value={item.start} onChange={(e) => upd('start', e.target.value)} className={field} placeholder="Start (e.g. 2022)" />
                <input value={item.end} onChange={(e) => upd('end', e.target.value)} className={field} placeholder="End (e.g. Present)" />
              </div>
              <textarea value={item.description} onChange={(e) => upd('description', e.target.value)} rows={3} className={`${field} resize-none`} placeholder="One bullet per line" />
            </>
          )}
        />
      </Section>

      <Section title="Education">
        <RepeatableList
          items={cv.education}
          onChange={(v) => set('education', v)}
          blank={{ degree: '', school: '', start: '', end: '', description: '' }}
          addLabel="Add education"
          render={(item, upd) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={item.degree} onChange={(e) => upd('degree', e.target.value)} className={field} placeholder="Degree" />
              <input value={item.school} onChange={(e) => upd('school', e.target.value)} className={field} placeholder="School" />
              <input value={item.start} onChange={(e) => upd('start', e.target.value)} className={field} placeholder="Start" />
              <input value={item.end} onChange={(e) => upd('end', e.target.value)} className={field} placeholder="End" />
            </div>
          )}
        />
      </Section>

      <Section title="Skills (grouped — shown on the CV sidebar)">
        <RepeatableList
          items={cv.skill_groups}
          onChange={(v) => set('skill_groups', v)}
          blank={{ label: '', items: [] }}
          addLabel="Add category"
          render={(item, upd) => (
            <div className="grid gap-3 sm:grid-cols-[0.4fr_1fr]">
              <input value={item.label} onChange={(e) => upd('label', e.target.value)} className={field} placeholder="Category (e.g. Frontend)" />
              <input
                value={(item.items || []).join(', ')}
                onChange={(e) => upd('items', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
                className={field}
                placeholder="Items, comma separated (React, Vite, …)"
              />
            </div>
          )}
        />
      </Section>

      <Section title="Key Projects">
        <RepeatableList
          items={cv.projects}
          onChange={(v) => set('projects', v)}
          blank={{ name: '', description: '', tech: '', link: '' }}
          addLabel="Add project"
          render={(item, upd) => (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={item.name} onChange={(e) => upd('name', e.target.value)} className={field} placeholder="Project name" />
                <input value={item.link} onChange={(e) => upd('link', e.target.value)} className={field} placeholder="Link (GitHub / live URL)" />
              </div>
              <input value={item.tech} onChange={(e) => upd('tech', e.target.value)} className={field} placeholder="Tech (e.g. React, Laravel, MySQL)" />
              <textarea value={item.description} onChange={(e) => upd('description', e.target.value)} rows={2} className={`${field} resize-none`} placeholder="One-line description" />
            </>
          )}
        />
      </Section>

      <Section title="Languages">
        <RepeatableList
          items={cv.languages}
          onChange={(v) => set('languages', v)}
          blank={{ name: '', level: '' }}
          addLabel="Add language"
          render={(item, upd) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={item.name} onChange={(e) => upd('name', e.target.value)} className={field} placeholder="Language" />
              <input value={item.level} onChange={(e) => upd('level', e.target.value)} className={field} placeholder="Level (e.g. Fluent)" />
            </div>
          )}
        />
      </Section>

      <Section title="Certifications">
        <RepeatableList
          items={cv.certifications}
          onChange={(v) => set('certifications', v)}
          blank={{ name: '', issuer: '', year: '' }}
          addLabel="Add certification"
          render={(item, upd) => (
            <div className="grid gap-3 sm:grid-cols-3">
              <input value={item.name} onChange={(e) => upd('name', e.target.value)} className={field} placeholder="Name" />
              <input value={item.issuer} onChange={(e) => upd('issuer', e.target.value)} className={field} placeholder="Issuer" />
              <input value={item.year} onChange={(e) => upd('year', e.target.value)} className={field} placeholder="Year" />
            </div>
          )}
        />
      </Section>
    </form>
  )
}
