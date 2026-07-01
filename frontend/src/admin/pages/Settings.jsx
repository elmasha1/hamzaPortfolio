import { useEffect, useState } from 'react'
import { settingsApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, X, ICON_NAMES, DynamicIcon } from '../../components/ui/Icons'

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
      journey_heading: '',
      journey_intro: '',
      ...data,
      // Guarantee nested shapes exist so every input stays controlled.
      socials: { linkedin: '', github: '', email: '', ...(data.socials || {}) },
      hero_roles: Array.isArray(data.hero_roles) ? data.hero_roles : [],
      stats: Array.isArray(data.stats) ? data.stats : [],
      testimonials: Array.isArray(data.testimonials) ? data.testimonials : [],
      tech_groups: Array.isArray(data.tech_groups) ? data.tech_groups : [],
      services: Array.isArray(data.services) ? data.services : [],
      overview_items: Array.isArray(data.overview_items) ? data.overview_items : [],
      journey: Array.isArray(data.journey) ? data.journey : [],
    }
  }

  const set = (k, v) => setS((p) => ({ ...p, [k]: v }))
  const setSocial = (k, v) => setS((p) => ({ ...p, socials: { ...p.socials, [k]: v } }))
  const setStat = (i, k, v) =>
    setS((p) => {
      const stats = [...p.stats]
      stats[i] = { ...stats[i], [k]: k === 'value' ? Number(v) : v }
      return { ...p, stats }
    })
  const addStat = () => set('stats', [...s.stats, { label: '', value: 0, suffix: '+' }])
  const removeStat = (i) => set('stats', s.stats.filter((_, idx) => idx !== i))

  const setTestimonial = (i, k, v) =>
    setS((p) => {
      const testimonials = [...p.testimonials]
      testimonials[i] = { ...testimonials[i], [k]: v }
      return { ...p, testimonials }
    })
  const addTestimonial = () =>
    set('testimonials', [...s.testimonials, { quote: '', name: '', role: '' }])
  const removeTestimonial = (i) =>
    set('testimonials', s.testimonials.filter((_, idx) => idx !== i))

  const setTechGroup = (i, k, v) =>
    setS((p) => {
      const tech_groups = [...p.tech_groups]
      tech_groups[i] = { ...tech_groups[i], [k]: v }
      return { ...p, tech_groups }
    })
  const addTechGroup = () => set('tech_groups', [...s.tech_groups, { label: '', items: [] }])
  const removeTechGroup = (i) => set('tech_groups', s.tech_groups.filter((_, idx) => idx !== i))

  const setService = (i, k, v) =>
    setS((p) => {
      const services = [...p.services]
      services[i] = { ...services[i], [k]: v }
      return { ...p, services }
    })
  const addService = () => set('services', [...s.services, { title: '', description: '' }])
  const removeService = (i) => set('services', s.services.filter((_, idx) => idx !== i))

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
        <Labeled label="Location / rhythm line (e.g. Rabat ⇄ Remote · Code · Deploy)">
          <input value={s.hero_location} onChange={(e) => set('hero_location', e.target.value)} className={field} />
        </Labeled>
        <Labeled label="Location (footer meta, e.g. Rabat, Morocco)">
          <input value={s.location} onChange={(e) => set('location', e.target.value)} className={field} />
        </Labeled>
        <Labeled label="Profile photo URL (leave blank for the local placeholder)">
          <input value={s.profile_photo} onChange={(e) => set('profile_photo', e.target.value)} className={field} placeholder="https://… or /assets/me.jpg" />
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

      <Section title="About">
        <Labeled label="Bio">
          <textarea value={s.bio} onChange={(e) => set('bio', e.target.value)} rows={3} className={`${field} resize-none`} />
        </Labeled>
      </Section>

      <Section title="Stats">
        {s.stats.map((st, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={st.label} onChange={(e) => setStat(i, 'label', e.target.value)} className={field} placeholder="Label" />
            <input value={st.value} onChange={(e) => setStat(i, 'value', e.target.value)} type="number" className="w-24 rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm" placeholder="0" />
            <input value={st.suffix} onChange={(e) => setStat(i, 'suffix', e.target.value)} className="w-16 rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm" placeholder="+" />
            <button type="button" onClick={() => removeStat(i)} className="px-2 text-muted hover:text-coral" aria-label="Remove stat">
              <X size={16} />
            </button>
          </div>
        ))}
        <button type="button" onClick={addStat} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <Plus size={16} /> Add stat
        </button>
      </Section>

      <Section title="Technologies (grouped capabilities)">
        <div className="space-y-4">
          {s.tech_groups.map((g, i) => (
            <div key={i} className="relative rounded-xl border border-line bg-white/[0.02] p-4">
              <button type="button" onClick={() => removeTechGroup(i)} aria-label="Remove group" className="absolute right-3 top-3 text-muted transition hover:text-coral">
                <X size={16} />
              </button>
              <div className="grid gap-3 pr-6 sm:grid-cols-[0.4fr_1fr]">
                <input value={g.label} onChange={(e) => setTechGroup(i, 'label', e.target.value)} className={field} placeholder="Category (e.g. Frontend)" />
                <input
                  value={(g.items || []).join(', ')}
                  onChange={(e) => setTechGroup(i, 'items', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
                  className={field}
                  placeholder="Items, comma separated (React, Vite, …)"
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addTechGroup} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <Plus size={16} /> Add category
          </button>
        </div>
      </Section>

      <Section title="Services">
        <div className="space-y-4">
          {s.services.map((sv, i) => (
            <div key={i} className="relative rounded-xl border border-line bg-white/[0.02] p-4">
              <button type="button" onClick={() => removeService(i)} aria-label="Remove service" className="absolute right-3 top-3 text-muted transition hover:text-coral">
                <X size={16} />
              </button>
              <div className="space-y-3 pr-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-heading">
                    <DynamicIcon name={sv.icon} size={18} strokeWidth={1.5} />
                  </span>
                  <select value={sv.icon || 'Code'} onChange={(e) => setService(i, 'icon', e.target.value)} className={`${field} max-w-[12rem]`}>
                    {ICON_NAMES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <input value={sv.title} onChange={(e) => setService(i, 'title', e.target.value)} className={field} placeholder="Service title" />
                </div>
                <textarea value={sv.description} onChange={(e) => setService(i, 'description', e.target.value)} rows={2} className={`${field} resize-none`} placeholder="One-line description" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addService} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <Plus size={16} /> Add service
          </button>
        </div>
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

      <Section title="Testimonials">
        <div className="space-y-4">
          {s.testimonials.map((t, i) => (
            <div key={i} className="relative rounded-xl border border-line bg-white/[0.02] p-4">
              <button type="button" onClick={() => removeTestimonial(i)} aria-label="Remove testimonial" className="absolute right-3 top-3 text-muted transition hover:text-coral">
                <X size={16} />
              </button>
              <textarea value={t.quote} onChange={(e) => setTestimonial(i, 'quote', e.target.value)} rows={3} className={`${field} resize-none pr-6`} placeholder="Quote" />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input value={t.name} onChange={(e) => setTestimonial(i, 'name', e.target.value)} className={field} placeholder="Name" />
                <input value={t.role} onChange={(e) => setTestimonial(i, 'role', e.target.value)} className={field} placeholder="Role / company" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addTestimonial} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <Plus size={16} /> Add testimonial
          </button>
        </div>
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
  )
}
