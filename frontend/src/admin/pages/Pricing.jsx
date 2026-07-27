import { useEffect, useState } from 'react'
import { pricingApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, ChevronUp, ChevronDown, Trash2, X } from '../../components/ui/Icons'

const field =
  'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

const emptyRow = () => ({
  title: '',
  best_for: '',
  deliverables: [],
  timeline: '',
  price_from: '',
  price_note: '',
  cta_label: '',
})

/**
 * Legacy pricing tiers → v2 engagement rows. Runs once on load when the new
 * shape is still empty, so existing dashboard content is carried over instead
 * of being retyped; nothing is deleted until you save.
 */
function rowsFromTiers(tiers) {
  return tiers.map((t) => ({
    title: t.name || '',
    best_for: t.description || '',
    deliverables: Array.isArray(t.features) ? t.features : [],
    timeline: '',
    price_from: t.price || '',
    price_note: t.period || '',
    cta_label: '',
  }))
}

export default function Pricing() {
  const toast = useToast()
  const [p, setP] = useState(null)
  const [saving, setSaving] = useState(false)
  const [migrated, setMigrated] = useState(false)

  useEffect(() => {
    pricingApi
      .get()
      .then((d) => {
        const tiers = Array.isArray(d.tiers) ? d.tiers : []
        const rows = Array.isArray(d.rows) ? d.rows : []
        const carried = rows.length === 0 && tiers.length > 0
        setMigrated(carried)
        setP({
          heading: d.heading || '',
          subline: d.subline || '',
          note: d.note || '',
          rows: carried ? rowsFromTiers(tiers) : rows,
          tiers,
          faq: Array.isArray(d.faq) ? d.faq : [],
        })
      })
      .catch(() => toast.error('Could not load the engagement models.'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setP((prev) => ({ ...prev, [k]: v }))

  /* rows */
  const setRow = (i, k, v) => set('rows', p.rows.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)))
  const moveRow = (i, dir) =>
    set(
      'rows',
      (() => {
        const t = i + dir
        if (t < 0 || t >= p.rows.length) return p.rows
        const n = [...p.rows]
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
      setMigrated(false)
      toast.success('Saved.')
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
          <h2 className="font-heading text-2xl font-semibold text-heading">Ways to work together</h2>
          <p className="mt-1 text-sm text-muted">
            The engagement rows, footnote and FAQ on the home page. The FAQ shows under the contact
            form.
          </p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {migrated && (
        <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-heading">
          Your old pricing tiers were carried over into the new row format below. Review them and
          press <span className="font-semibold">Save changes</span> to keep them.
        </p>
      )}

      {/* Header copy */}
      <div className="space-y-3 rounded-2xl border border-line bg-white/[0.04] p-5 shadow-soft">
        <input value={p.heading} onChange={(e) => set('heading', e.target.value)} className={field} placeholder="Heading (e.g. Three ways this usually starts.)" />
        <input value={p.subline} onChange={(e) => set('subline', e.target.value)} className={field} placeholder="Subline (scope and price are set after a call…)" />
        <input value={p.note} onChange={(e) => set('note', e.target.value)} className={field} placeholder="Note next to the CTA under the rows" />
      </div>

      {/* Engagement rows */}
      {p.rows.map((r, i) => (
        <div key={i} className="rounded-2xl border border-line bg-white/[0.04] p-5 shadow-soft">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex flex-col">
              <button type="button" onClick={() => moveRow(i, -1)} disabled={i === 0} aria-label="Move row up" className="text-muted hover:text-heading disabled:opacity-30"><ChevronUp size={16} /></button>
              <button type="button" onClick={() => moveRow(i, 1)} disabled={i === p.rows.length - 1} aria-label="Move row down" className="text-muted hover:text-heading disabled:opacity-30"><ChevronDown size={16} /></button>
            </div>
            <input value={r.title} onChange={(e) => setRow(i, 'title', e.target.value)} className={`${field} font-heading font-semibold`} placeholder="Row title (Build from scratch)" />
            <button type="button" onClick={() => set('rows', p.rows.filter((_, idx) => idx !== i))} aria-label="Remove row" className="shrink-0 rounded-lg p-2 text-muted hover:text-coral"><Trash2 size={16} /></button>
          </div>

          <textarea value={r.best_for} onChange={(e) => setRow(i, 'best_for', e.target.value)} rows={2} className={`${field} resize-none`} placeholder="Best for — who this row is aimed at" />

          <textarea
            value={(r.deliverables || []).join('\n')}
            onChange={(e) => setRow(i, 'deliverables', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
            rows={4}
            className={`${field} mt-3 resize-none`}
            placeholder={'Deliverables — one per line'}
          />

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <input value={r.timeline} onChange={(e) => setRow(i, 'timeline', e.target.value)} className={field} placeholder="Typical timeline · 6–12 weeks" />
            <input value={r.price_from} onChange={(e) => setRow(i, 'price_from', e.target.value)} className={field} placeholder="From $6,000" />
            <input value={r.price_note} onChange={(e) => setRow(i, 'price_note', e.target.value)} className={field} placeholder="fixed scope, milestone billed" />
          </div>

          <p className="mt-3 text-sm text-muted">
            Leave <span className="font-medium text-heading">From</span> empty for the hiring row —
            it shows a CV download instead of a price.
          </p>
          {!r.price_from && (
            <input value={r.cta_label} onChange={(e) => setRow(i, 'cta_label', e.target.value)} className={`${field} mt-2`} placeholder="CV link label (Download CV)" />
          )}
        </div>
      ))}
      <button type="button" onClick={() => set('rows', [...p.rows, emptyRow()])} className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-body hover:text-heading">
        <Plus size={16} /> Add row
      </button>

      {/* FAQ */}
      <div className="rounded-2xl border border-line bg-white/[0.04] p-5 shadow-soft">
        <h3 className="mb-1 font-heading text-lg font-semibold text-heading">Before you write (FAQ)</h3>
        <p className="mb-4 text-sm text-muted">Shown under the contact form, where the objections come up.</p>
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
