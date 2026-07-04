import { useEffect, useState } from 'react'
import { technologiesApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, ChevronUp, ChevronDown, Trash2, X } from '../../components/ui/Icons'
import { TechIcon, TECH_ICON_KEYS } from '../../lib/techIcons'

const field =
  'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function Technologies() {
  const toast = useToast()
  const [groups, setGroups] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    technologiesApi
      .get()
      .then((d) => setGroups(Array.isArray(d) ? d : []))
      .catch(() => toast.error('Could not load technologies.'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ------- category ops ------- */
  const addCat = () => setGroups((g) => [...g, { label: 'New category', items: [] }])
  const removeCat = (ci) => setGroups((g) => g.filter((_, i) => i !== ci))
  const moveCat = (ci, dir) =>
    setGroups((g) => {
      const t = ci + dir
      if (t < 0 || t >= g.length) return g
      const n = [...g]
      ;[n[ci], n[t]] = [n[t], n[ci]]
      return n
    })
  const setLabel = (ci, v) => setGroups((g) => g.map((c, i) => (i === ci ? { ...c, label: v } : c)))

  /* ------- item ops ------- */
  const addItem = (ci) => setGroups((g) => g.map((c, i) => (i === ci ? { ...c, items: [...(c.items || []), { name: '', icon: '' }] } : c)))
  const removeItem = (ci, ii) => setGroups((g) => g.map((c, i) => (i === ci ? { ...c, items: c.items.filter((_, j) => j !== ii) } : c)))
  const moveItem = (ci, ii, dir) =>
    setGroups((g) =>
      g.map((c, i) => {
        if (i !== ci) return c
        const t = ii + dir
        if (t < 0 || t >= c.items.length) return c
        const n = [...c.items]
        ;[n[ii], n[t]] = [n[t], n[ii]]
        return { ...c, items: n }
      })
    )
  const setItem = (ci, ii, key, v) =>
    setGroups((g) => g.map((c, i) => (i === ci ? { ...c, items: c.items.map((it, j) => (j === ii ? { ...it, [key]: v } : it)) } : c)))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await technologiesApi.update(groups)
      toast.success('Technologies saved.')
    } catch {
      toast.error('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  if (!groups) return <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-heading">Technologies</h2>
          <p className="mt-1 text-sm text-muted">Grouped tech stack shown on the About page. Each item has a name + a brand icon.</p>
        </div>
        <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {groups.map((cat, ci) => (
        <div key={ci} className="rounded-2xl border border-line bg-white/[0.04] p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex flex-col">
              <button type="button" onClick={() => moveCat(ci, -1)} disabled={ci === 0} aria-label="Move category up" className="text-muted hover:text-heading disabled:opacity-30"><ChevronUp size={16} /></button>
              <button type="button" onClick={() => moveCat(ci, 1)} disabled={ci === groups.length - 1} aria-label="Move category down" className="text-muted hover:text-heading disabled:opacity-30"><ChevronDown size={16} /></button>
            </div>
            <input value={cat.label} onChange={(e) => setLabel(ci, e.target.value)} className={`${field} font-heading font-semibold`} placeholder="Category (e.g. Frontend)" />
            <button type="button" onClick={() => removeCat(ci)} aria-label="Remove category" className="shrink-0 rounded-lg p-2 text-muted hover:text-coral"><Trash2 size={16} /></button>
          </div>

          <div className="space-y-2">
            {(cat.items || []).map((it, ii) => (
              <div key={ii} className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.02] p-2">
                <div className="flex flex-col">
                  <button type="button" onClick={() => moveItem(ci, ii, -1)} disabled={ii === 0} aria-label="Move up" className="text-muted hover:text-heading disabled:opacity-30"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => moveItem(ci, ii, 1)} disabled={ii === cat.items.length - 1} aria-label="Move down" className="text-muted hover:text-heading disabled:opacity-30"><ChevronDown size={14} /></button>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-heading">
                  <TechIcon icon={it.icon} size={18} />
                </span>
                <input value={it.name} onChange={(e) => setItem(ci, ii, 'name', e.target.value)} className={field} placeholder="Name (e.g. React)" />
                <select value={it.icon || ''} onChange={(e) => setItem(ci, ii, 'icon', e.target.value)} className={`${field} max-w-[10rem]`}>
                  <option value="">— icon —</option>
                  {TECH_ICON_KEYS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <button type="button" onClick={() => removeItem(ci, ii)} aria-label="Remove item" className="shrink-0 rounded-lg p-2 text-muted hover:text-coral"><X size={16} /></button>
              </div>
            ))}
            <button type="button" onClick={() => addItem(ci)} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              <Plus size={15} /> Add item
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addCat} className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-body hover:text-heading">
        <Plus size={16} /> Add category
      </button>
    </form>
  )
}
