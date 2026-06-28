import { useEffect, useState } from 'react'
import { settingsApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, X } from '../../components/ui/Icons'

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
      profile_photo: '',
      bio: '',
      available: true,
      ...data,
      // Guarantee nested shapes exist so every input stays controlled.
      socials: { linkedin: '', github: '', email: '', ...(data.socials || {}) },
      hero_roles: Array.isArray(data.hero_roles) ? data.hero_roles : [],
      stats: Array.isArray(data.stats) ? data.stats : [],
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
            {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
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
        <Labeled label="Title">
          <input value={s.hero_title} onChange={(e) => set('hero_title', e.target.value)} className={field} />
        </Labeled>
        <Labeled label="Subtitle">
          <textarea value={s.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} rows={3} className={`${field} resize-none`} />
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
          <input type="checkbox" checked={s.available} onChange={(e) => set('available', e.target.checked)} className="h-4 w-4 accent-[#2563EB]" />
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
