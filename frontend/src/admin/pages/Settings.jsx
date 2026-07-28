import { useEffect, useState } from 'react'
import { settingsApi, photoApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, X, ICON_NAMES, DynamicIcon } from '../../components/ui/Icons'
import ImageUploader from '../components/ImageUploader'
import AccountSection from '../components/AccountSection'

const field =
  'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.04] p-6 shadow-soft">
      <h3 className="mb-4 font-heading text-lg font-semibold text-heading">
        {title}
      </h3>
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

export default function Settings() {
  const toast = useToast()
  const [s, setS] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    settingsApi
      .get()
      .then((data) => setS(normalize(data)))
      .catch(() => toast.error('Could not load settings.'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Ensure nested shapes exist so the form is controlled.
  function normalize(data) {
    return {
      whatsapp_number: '',
      whatsapp_message: '',
      hero_title: '',
      hero_subtitle: '',
      hero_eyebrow: '',
      hero_location: '',
      location: '',
      profile_photo: '',
      bio: '',
      available: true,
      overview_intro: '',
      response_time: '',
      journey_heading: '',
      journey_intro: '',
      process_heading: '',
      ...data,
      // Guarantee nested shapes exist so every input stays controlled.
      socials: { linkedin: '', github: '', email: '', ...(data.socials || {}) },
      hero_roles: Array.isArray(data.hero_roles) ? data.hero_roles : [],
      overview_items: Array.isArray(data.overview_items) ? data.overview_items : [],
      hero_chain: {
        label: '',
        nodes: [],
        ...(data.hero_chain && typeof data.hero_chain === 'object' ? data.hero_chain : {}),
      },
      metrics: Array.isArray(data.metrics) ? data.metrics : [],
      // `statement` used to be a plain string — accept both shapes.
      statement:
        typeof data.statement === 'string'
          ? { text: data.statement, label: '' }
          : { text: '', label: '', ...(data.statement || {}) },
      process: Array.isArray(data.process) ? data.process : [],
      whats_next: Array.isArray(data.whats_next) ? data.whats_next : [],
    }
  }

  const set = (k, v) => setS((p) => ({ ...p, [k]: v }))
  const setSocial = (k, v) => setS((p) => ({ ...p, socials: { ...p.socials, [k]: v } }))
  const setNested = (key, k, v) => setS((p) => ({ ...p, [key]: { ...p[key], [k]: v } }))

  /* Generic repeatable-list helpers for the v2 content blocks. */
  const setItem = (key, i, k, v) =>
    setS((p) => {
      const list = [...(p[key] || [])]
      list[i] = { ...list[i], [k]: v }
      return { ...p, [key]: list }
    })
  const addItem = (key, blank) => set(key, [...(s[key] || []), blank])
  const removeItem = (key, i) => set(key, (s[key] || []).filter((_, idx) => idx !== i))

  const setOverview = (i, k, v) =>
    setS((p) => {
      const overview_items = [...p.overview_items]
      overview_items[i] = { ...overview_items[i], [k]: v }
      return { ...p, overview_items }
    })
  const addOverview = () =>
    set('overview_items', [...s.overview_items, { icon: 'Code', title: '', description: '', tech: [], tags: [] }])
  const removeOverview = (i) => set('overview_items', s.overview_items.filter((_, idx) => idx !== i))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await settingsApi.update(s)
      toast.success('Settings saved.')
    } catch {
      toast.error('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  if (!s) {
    return <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04] shadow-soft" />
  }

  return (
    // The account form is a sibling of this one, never a child: nesting one
    // <form> inside another is invalid HTML, and the inner submit would end up
    // saving site settings instead of changing a password.
    <div className="space-y-6">
      <AccountSection />

      <form onSubmit={save} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-heading">
          Site settings
        </h2>
        <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
          <span className="relative z-10 inline-flex items-center gap-2">
            {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />}
            Save changes
          </span>
        </button>
      </div>

      <Section title="WhatsApp">
        <Labeled label="Number (international, digits only)">
          <input value={s.whatsapp_number} onChange={(e) => set('whatsapp_number', e.target.value)} className={field} placeholder="212600000000" />
        </Labeled>
        <Labeled label="Prefilled message">
          <input value={s.whatsapp_message} onChange={(e) => set('whatsapp_message', e.target.value)} className={field} />
        </Labeled>
      </Section>

      <Section title="Hero">
        <Labeled label="Eyebrow (small label above the headline)">
          <input value={s.hero_eyebrow} onChange={(e) => set('hero_eyebrow', e.target.value)} className={field} placeholder="Full-Stack Developer" />
        </Labeled>
        <Labeled label="Title">
          <input value={s.hero_title} onChange={(e) => set('hero_title', e.target.value)} className={field} />
        </Labeled>
        <Labeled label="Subtitle">
          <textarea value={s.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} rows={3} className={`${field} resize-none`} />
        </Labeled>
        <Labeled label="Utility rail — short facts separated by · (e.g. Rabat, MA · UTC+1 · Available now · Remote or on-site)">
          <input value={s.hero_location} onChange={(e) => set('hero_location', e.target.value)} className={field} />
        </Labeled>
        <Labeled label="Stack chain label (under the CTAs)">
          <input
            value={s.hero_chain.label}
            onChange={(e) => setNested('hero_chain', 'label', e.target.value)}
            className={field}
            placeholder="What I own, end to end"
          />
        </Labeled>
        <Labeled label="Stack chain nodes (comma separated — the request path)">
          <input
            value={(s.hero_chain.nodes || []).join(', ')}
            onChange={(e) =>
              setNested('hero_chain', 'nodes', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))
            }
            className={field}
            placeholder="Client, API, Queue, DB, CI / CD, Monitoring"
          />
        </Labeled>
        <Labeled label="Location (footer meta, e.g. Rabat, Morocco)">
          <input value={s.location} onChange={(e) => set('location', e.target.value)} className={field} />
        </Labeled>
        <Labeled label="Response time (footer status, e.g. Replies within 24h)">
          <input value={s.response_time} onChange={(e) => set('response_time', e.target.value)} className={field} />
        </Labeled>
        <Labeled label="Profile photo (used by the hero, About portrait and CV)">
          <ImageUploader
            value={s.profile_photo}
            alt="Profile photo"
            uploadFn={photoApi.upload}
            onUploaded={(d) => {
              set('profile_photo', d.profile_photo)
              toast.success('Photo uploaded — it now shows across the site.')
            }}
            onRemove={async () => {
              try {
                await photoApi.remove()
                set('profile_photo', '')
                toast.success('Photo removed — the placeholder will show.')
              } catch {
                toast.error('Could not remove the photo.')
              }
            }}
          />
        </Labeled>
        <Labeled label="Rotating roles (comma separated)">
          <input
            value={s.hero_roles.join(', ')}
            onChange={(e) => set('hero_roles', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
            className={field}
          />
        </Labeled>
        <label className="flex cursor-pointer items-center gap-3 pt-1">
          <input type="checkbox" checked={s.available} onChange={(e) => set('available', e.target.checked)} className="h-4 w-4 accent-white" />
          <span className="text-sm font-medium text-heading">Show "Available for work" badge</span>
        </label>
      </Section>

      <Section title="Proof strip — the four numbers under the hero">
        <p className="text-sm text-muted">
          Numbers count up when they scroll into view. Leading zeros are kept (&ldquo;06&rdquo; stays
          &ldquo;06&rdquo;), and units work too (&ldquo;24h&rdquo;). Leave empty to hide the strip.
        </p>
        <div className="space-y-3 pt-2">
          {s.metrics.map((m, i) => (
            <div key={i} className="relative rounded-xl border border-line bg-white/[0.02] p-4">
              <button type="button" onClick={() => removeItem('metrics', i)} aria-label="Remove metric" className="absolute right-3 top-3 text-muted transition hover:text-coral">
                <X size={16} />
              </button>
              <div className="grid gap-3 pr-6 sm:grid-cols-[7rem_5rem_1fr]">
                <input value={m.value || ''} onChange={(e) => setItem('metrics', i, 'value', e.target.value)} className={field} placeholder="Value (06)" />
                <input value={m.suffix || ''} onChange={(e) => setItem('metrics', i, 'suffix', e.target.value)} className={field} placeholder="Suffix (+)" />
                <input value={m.label || ''} onChange={(e) => setItem('metrics', i, 'label', e.target.value)} className={field} placeholder="Label (Years shipping)" />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addItem('metrics', { value: '', suffix: '', label: '' })} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <Plus size={16} /> Add metric
          </button>
        </div>
      </Section>

      <Section title="Statement band">
        <p className="text-sm text-muted">
          The full-bleed sentence between Selected work and How I work. Leave the text empty to hide
          the band entirely.
        </p>
        <Labeled label="Statement">
          <textarea
            value={s.statement.text}
            onChange={(e) => setNested('statement', 'text', e.target.value)}
            rows={3}
            className={`${field} resize-none`}
            placeholder="Shipping is a feature. Everything I build is designed to be maintained by whoever comes next."
          />
        </Labeled>
        <Labeled label="Attribution (small mono label at the right)">
          <input value={s.statement.label} onChange={(e) => setNested('statement', 'label', e.target.value)} className={field} placeholder="Working principle" />
        </Labeled>
      </Section>

      <Section title="How I work — scope → build → ship → maintain">
        <Labeled label="Heading">
          <input value={s.process_heading} onChange={(e) => set('process_heading', e.target.value)} className={field} placeholder="How I work." />
        </Labeled>
        <p className="text-sm text-muted">
          Each step ends with one concrete artefact — that is what makes the process credible.
          Leave the list empty to hide the section.
        </p>
        <div className="space-y-3 pt-2">
          {s.process.map((step, i) => (
            <div key={i} className="relative rounded-xl border border-line bg-white/[0.02] p-4">
              <button type="button" onClick={() => removeItem('process', i)} aria-label="Remove step" className="absolute right-3 top-3 text-muted transition hover:text-coral">
                <X size={16} />
              </button>
              <div className="space-y-3 pr-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={step.title || ''} onChange={(e) => setItem('process', i, 'title', e.target.value)} className={field} placeholder="Step title (Scope)" />
                  <input value={step.artifact || ''} onChange={(e) => setItem('process', i, 'artifact', e.target.value)} className={field} placeholder="Artefact (Written spec + estimate)" />
                </div>
                <textarea value={step.body || ''} onChange={(e) => setItem('process', i, 'body', e.target.value)} rows={2} className={`${field} resize-none`} placeholder="Two lines on what happens in this step" />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => addItem('process', { title: '', body: '', artifact: '' })} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <Plus size={16} /> Add step
          </button>
        </div>
      </Section>

      <Section title="Contact — what happens next">
        <Labeled label="Steps (one per line, shown under the contact heading)">
          <textarea
            value={(s.whats_next || []).join('\n')}
            onChange={(e) => set('whats_next', e.target.value.split('\n').map((x) => x.trim()).filter(Boolean))}
            rows={3}
            className={`${field} resize-none`}
            placeholder={'A real reply within 24 hours — with questions, not a template.'}
          />
        </Labeled>
      </Section>

      <Section title="About">
        <Labeled label="Bio">
          <textarea value={s.bio} onChange={(e) => set('bio', e.target.value)} rows={3} className={`${field} resize-none`} />
        </Labeled>
      </Section>

      <Section title="Overview — “This is what I do”">
        <Labeled label="Intro line">
          <input value={s.overview_intro} onChange={(e) => set('overview_intro', e.target.value)} className={field} />
        </Labeled>
        <div className="space-y-4 pt-2">
          {s.overview_items.map((it, i) => (
            <div key={i} className="relative rounded-xl border border-line bg-white/[0.02] p-4">
              <button type="button" onClick={() => removeOverview(i)} aria-label="Remove item" className="absolute right-3 top-3 text-muted transition hover:text-coral">
                <X size={16} />
              </button>
              <div className="space-y-3 pr-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-heading">
                    <DynamicIcon name={it.icon} size={18} strokeWidth={1.5} />
                  </span>
                  <select value={it.icon || 'Code'} onChange={(e) => setOverview(i, 'icon', e.target.value)} className={`${field} max-w-[12rem]`}>
                    {ICON_NAMES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <input value={it.title} onChange={(e) => setOverview(i, 'title', e.target.value)} className={field} placeholder="Capability title" />
                </div>
                <textarea value={it.description} onChange={(e) => setOverview(i, 'description', e.target.value)} rows={2} className={`${field} resize-none`} placeholder="One-line description" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={(it.tech || []).join(', ')}
                    onChange={(e) => setOverview(i, 'tech', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
                    className={field}
                    placeholder="Tech, comma separated"
                  />
                  <input
                    value={(it.tags || []).join(', ')}
                    onChange={(e) => setOverview(i, 'tags', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
                    className={field}
                    placeholder="Meta tags (e.g. 3+ years, Full-stack)"
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={addOverview} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <Plus size={16} /> Add capability
          </button>
        </div>
      </Section>

      <Section title="My Journey (timeline)">
        <Labeled label="Heading">
          <input value={s.journey_heading} onChange={(e) => set('journey_heading', e.target.value)} className={field} placeholder="From zero to full-stack." />
        </Labeled>
        <Labeled label="Intro line">
          <input value={s.journey_intro} onChange={(e) => set('journey_intro', e.target.value)} className={field} />
        </Labeled>
        <p className="text-sm text-muted">
          Milestones (add / edit / remove / reorder) are managed on the dedicated <span className="font-medium text-heading">Journey</span> page.
        </p>
      </Section>

      <Section title="Social links">
        <Labeled label="LinkedIn URL">
          <input value={s.socials.linkedin} onChange={(e) => setSocial('linkedin', e.target.value)} className={field} />
        </Labeled>
        <Labeled label="GitHub URL">
          <input value={s.socials.github} onChange={(e) => setSocial('github', e.target.value)} className={field} />
        </Labeled>
        <Labeled label="Email">
          <input value={s.socials.email} onChange={(e) => setSocial('email', e.target.value)} className={field} />
        </Labeled>
      </Section>
      </form>
    </div>
  )
}
