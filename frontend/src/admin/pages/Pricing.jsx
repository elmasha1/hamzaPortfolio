import { useEffect, useState } from 'react'
import { pricingApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, ChevronUp, ChevronDown, Trash2, X } from '../../components/ui/Icons'

const field =
  'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

const emptyTier = () => ({
  name: '',
  price: '',
  period: '',
  description: '',
  features: [],
  highlighted: false,
  cta: 'Start a project',
})

export default function Pricing() {
  const toast = useToast()
  const [p, setP] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    pricingApi
      .get()
      .then((d) =>
        setP({
          heading: d.heading || '',
          subline: d.subline || '',
          note: d.note || '',
          tiers: Array.isArray(d.tiers) ? d.tiers : [],
          faq: Array.isArray(d.faq) ? d.faq : [],
        })
      )
      .catch(() => toast.error('Could not load pricing.'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setP((prev) => ({ ...prev, [k]: v }))

  /* tiers */
  const setTier = (i, k, v) => set('tiers', p.tiers.map((t, idx) => (idx === i ? { ...t, [k]: v } : t)))
  const moveTier = (i, dir) =>
    set(
      'tiers',
      (() => {
        const t = i + dir
        if (t < 0 || t >= p.tiers.length) return p.tiers
        const n = [...p.tiers]
        ;[n[i], n[t]] = [n[t], n[i]]
        return n
      })()
    )

  /* faq */
  const setFaq = (i, k, v) => set('faq', p.faq.map((f, idx) => (idx === i ? { ...f, [k]: v } : f)))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await pricingApi.update(p)
      toast.success('Pricing saved.')
    } catch {
      toast.error('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  if (!p) return <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-heading">Pricing</h2>
          <p className="mt-1 text-sm text-muted">Tiers, footnote and FAQ shown on the /pricing page.</p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {/* Header copy */}
      <div className="space-y-3 rounded-2xl border border-line bg-white/[0.04] p-5 shadow-soft">
        <input value={p.heading} onChange={(e) => set('heading', e.target.value)} className={field} placeholder="Heading (e.g. Simple, transparent pricing.)" />
        <input value={p.subline} onChange={(e) => set('subline', e.target.value)} className={field} placeholder="Subline" />
        <input value={p.note} onChange={(e) => set('note', e.target.value)} className={field} placeholder="Footnote (VAT / retainer note)" />
      </div>

      {/* Tiers */}
      {p.tiers.map((t, i) => (
        <div key={i} className="rounded-2xl border border-line bg-white/[0.04] p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex flex-col">
              <button type="button" onClick={() => moveTier(i, -1)} disabled={i === 0} aria-label="Move tier up" className="text-muted hover:text-heading disabled:opacity-30"><ChevronUp size={16} /></button>
              <button type="button" onClick={() => moveTier(i, 1)} disabled={i === p.tiers.length - 1} aria-label="Move tier down" className="text-muted hover:text-heading disabled:opacity-30"><ChevronDown size={16} /></button>
            </div>
            <input value={t.name} onChange={(e) => setTier(i, 'name', e.target.value)} className={`${field} font-heading font-semibold`} placeholder="Tier name" />
            <label className="flex shrink-0 items-center gap-2 text-sm text-body">
              <input type="checkbox" checked={!!t.highlighted} onChange={(e) => setTier(i, 'highlighted', e.target.checked)} className="h-4 w-4 accent-white" />
              Highlighted
            </label>
            <button type="button" onClick={() => set('tiers', p.tiers.filter((_, idx) => idx !== i))} aria-label="Remove tier" className="shrink-0 rounded-lg p-2 text-muted hover:text-coral"><Trash2 size={16} /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={t.price} onChange={(e) => setTier(i, 'price', e.target.value)} className={field} placeholder="Price (from $2,500 / Let's talk)" />
            <input value={t.period} onChange={(e) => setTier(i, 'period', e.target.value)} className={field} placeholder="Delivery (3–6 weeks)" />
            <input value={t.cta} onChange={(e) => setTier(i, 'cta', e.target.value)} className={field} placeholder="CTA label" />
          </div>
          <textarea value={t.description} onChange={(e) => setTier(i, 'description', e.target.value)} rows={2} className={`${field} mt-3 resize-none`} placeholder="Short description" />
          <textarea
            value={(t.features || []).join('\n')}
            onChange={(e) => setTier(i, 'features', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
            rows={4}
            className={`${field} mt-3 resize-none`}
            placeholder={'Included features — one per line'}
          />
        </div>
      ))}
      <button type="button" onClick={() => set('tiers', [...p.tiers, emptyTier()])} className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-body hover:text-heading">
        <Plus size={16} /> Add tier
      </button>

      {/* FAQ */}
      <div className="rounded-2xl border border-line bg-white/[0.04] p-5 shadow-soft">
        <h3 className="mb-4 font-heading text-lg font-semibold text-heading">FAQ</h3>
        <div className="space-y-3">
          {p.faq.map((f, i) => (
            <div key={i} className="relative rounded-xl border border-line bg-white/[0.02] p-3">
              <button type="button" onClick={() => set('faq', p.faq.filter((_, idx) => idx !== i))} aria-label="Remove question" className="absolute right-2 top-2 text-muted hover:text-coral"><X size={15} /></button>
              <input value={f.q} onChange={(e) => setFaq(i, 'q', e.target.value)} className={`${field} pr-8`} placeholder="Question" />
              <textarea value={f.a} onChange={(e) => setFaq(i, 'a', e.target.value)} rows={2} className={`${field} mt-2 resize-none`} placeholder="Answer" />
            </div>
          ))}
          <button type="button" onClick={() => set('faq', [...p.faq, { q: '', a: '' }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            <Plus size={15} /> Add question
          </button>
        </div>
      </div>
    </form>
  )
}
