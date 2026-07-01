import { useEffect, useState } from 'react'
import { journeyApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, Trash2, Pencil, X, ChevronUp, ChevronDown } from '../../components/ui/Icons'

const field =
  'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

const EMPTY = { date_label: '', title: '', description: '', tags: [] }

export default function Journey() {
  const toast = useToast()
  const [items, setItems] = useState(null)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () =>
    journeyApi
      .list()
      .then(setItems)
      .catch(() => toast.error('Could not load milestones.'))

  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const startNew = () => setEditing({ ...EMPTY })
  const startEdit = (m) => setEditing({ ...EMPTY, ...m, tags: Array.isArray(m.tags) ? m.tags : [] })
  const setField = (k, v) => setEditing((e) => ({ ...e, [k]: v }))

  const save = async (ev) => {
    ev.preventDefault()
    setSaving(true)
    try {
      if (editing.id) await journeyApi.update(editing.id, editing)
      else await journeyApi.create(editing)
      toast.success(editing.id ? 'Milestone updated.' : 'Milestone created.')
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.status === 422 ? 'Please check the fields.' : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (m) => {
    if (!window.confirm(`Delete “${m.title}”?`)) return
    try {
      await journeyApi.remove(m.id)
      toast.success('Milestone deleted.')
      load()
    } catch {
      toast.error('Delete failed.')
    }
  }

  // Move a milestone up/down and persist the new order.
  const move = async (index, dir) => {
    const next = [...items]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setItems(next)
    try {
      await journeyApi.reorder(next.map((m) => m.id))
    } catch {
      toast.error('Reorder failed.')
      load()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-heading">My Journey — timeline</h2>
        {!editing && (
          <button onClick={startNew} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            <Plus size={16} /> New milestone
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={save} className="space-y-4 rounded-2xl border border-line bg-white/[0.04] p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-heading">
              {editing.id ? 'Edit milestone' : 'New milestone'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} aria-label="Cancel" className="text-muted hover:text-coral">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.35fr_1fr]">
            <label className="block">
              <span className="eyebrow mb-1 block">Date / period</span>
              <input value={editing.date_label || ''} onChange={(e) => setField('date_label', e.target.value)} className={field} placeholder="2021 / Present" />
            </label>
            <label className="block">
              <span className="eyebrow mb-1 block">Title</span>
              <input value={editing.title} onChange={(e) => setField('title', e.target.value)} className={field} required />
            </label>
          </div>
          <label className="block">
            <span className="eyebrow mb-1 block">Description</span>
            <textarea value={editing.description || ''} onChange={(e) => setField('description', e.target.value)} rows={3} className={`${field} resize-none`} />
          </label>
          <label className="block">
            <span className="eyebrow mb-1 block">Tags (comma separated)</span>
            <input
              value={(editing.tags || []).join(', ')}
              onChange={(e) => setField('tags', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
              className={field}
            />
          </label>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
              {saving ? 'Saving…' : editing.id ? 'Update milestone' : 'Create milestone'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-line px-5 py-2.5 text-sm text-body hover:text-heading">
              Cancel
            </button>
          </div>
        </form>
      ) : items === null ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
      ) : items.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white/[0.04] p-8 text-muted">No milestones yet — add your first one.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white/[0.04] shadow-soft">
          {items.map((m, i) => (
            <div key={m.id} className="flex items-center gap-4 border-b border-line px-4 py-4 last:border-0">
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="text-muted hover:text-heading disabled:opacity-30">
                  <ChevronUp size={16} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" className="text-muted hover:text-heading disabled:opacity-30">
                  <ChevronDown size={16} />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="shrink-0 text-xs uppercase tracking-[0.12em] text-muted">{m.date_label || '—'}</span>
                  <span className="truncate font-heading font-semibold text-heading">{m.title}</span>
                </div>
                {m.description && <p className="mt-0.5 truncate text-xs text-muted">{m.description}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => startEdit(m)} aria-label="Edit" className="rounded-lg p-2 text-muted hover:text-heading">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(m)} aria-label="Delete" className="rounded-lg p-2 text-muted hover:text-coral">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
