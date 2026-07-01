import { useEffect, useState } from 'react'
import { postsApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, Trash2, Pencil, X } from '../../components/ui/Icons'

const field =
  'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

const EMPTY = { title: '', slug: '', cover: '', excerpt: '', body: '', tags: [], read_time: 4, published: true }

const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—')

export default function Posts() {
  const toast = useToast()
  const [posts, setPosts] = useState(null)
  const [editing, setEditing] = useState(null) // null | {} (new) | post (edit)
  const [saving, setSaving] = useState(false)

  const load = () =>
    postsApi
      .list()
      .then(setPosts)
      .catch(() => toast.error('Could not load posts.'))

  useEffect(() => {
    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const startNew = () => setEditing({ ...EMPTY })
  const startEdit = (p) => setEditing({ ...EMPTY, ...p, tags: Array.isArray(p.tags) ? p.tags : [] })
  const cancel = () => setEditing(null)

  const setField = (k, v) => setEditing((e) => ({ ...e, [k]: v }))

  const save = async (ev) => {
    ev.preventDefault()
    setSaving(true)
    try {
      const payload = { ...editing, read_time: Number(editing.read_time) || 3 }
      if (editing.id) await postsApi.update(editing.id, payload)
      else await postsApi.create(payload)
      toast.success(editing.id ? 'Post updated.' : 'Post created.')
      setEditing(null)
      load()
    } catch (err) {
      toast.error(err.response?.status === 422 ? 'Please check the fields.' : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`Delete “${p.title}”?`)) return
    try {
      await postsApi.remove(p.id)
      toast.success('Post deleted.')
      load()
    } catch {
      toast.error('Delete failed.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-heading">Blog / Journal</h2>
        {!editing && (
          <button onClick={startNew} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            <Plus size={16} /> New post
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={save} className="space-y-4 rounded-2xl border border-line bg-white/[0.04] p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-heading">
              {editing.id ? 'Edit post' : 'New post'}
            </h3>
            <button type="button" onClick={cancel} aria-label="Cancel" className="text-muted hover:text-coral">
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="eyebrow mb-1 block">Title</span>
              <input value={editing.title} onChange={(e) => setField('title', e.target.value)} className={field} required />
            </label>
            <label className="block">
              <span className="eyebrow mb-1 block">Slug (blank = auto)</span>
              <input value={editing.slug} onChange={(e) => setField('slug', e.target.value)} className={field} placeholder="auto-from-title" />
            </label>
            <label className="block">
              <span className="eyebrow mb-1 block">Read time (min)</span>
              <input type="number" min="1" value={editing.read_time} onChange={(e) => setField('read_time', e.target.value)} className={field} />
            </label>
            <label className="block sm:col-span-2">
              <span className="eyebrow mb-1 block">Cover image URL</span>
              <input value={editing.cover || ''} onChange={(e) => setField('cover', e.target.value)} className={field} placeholder="https://… or /storage/…" />
            </label>
            <label className="block sm:col-span-2">
              <span className="eyebrow mb-1 block">Excerpt</span>
              <textarea value={editing.excerpt || ''} onChange={(e) => setField('excerpt', e.target.value)} rows={2} className={`${field} resize-none`} />
            </label>
            <label className="block sm:col-span-2">
              <span className="eyebrow mb-1 block">Tags (comma separated)</span>
              <input
                value={(editing.tags || []).join(', ')}
                onChange={(e) => setField('tags', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))}
                className={field}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="eyebrow mb-1 block">Body</span>
              <textarea value={editing.body || ''} onChange={(e) => setField('body', e.target.value)} rows={10} className={`${field} resize-y font-mono text-xs`} placeholder="One paragraph per line…" />
            </label>
            <label className="flex cursor-pointer items-center gap-3">
              <input type="checkbox" checked={!!editing.published} onChange={(e) => setField('published', e.target.checked)} className="h-4 w-4 accent-white" />
              <span className="text-sm font-medium text-heading">Published</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
              {saving ? 'Saving…' : editing.id ? 'Update post' : 'Create post'}
            </button>
            <button type="button" onClick={cancel} className="rounded-xl border border-line px-5 py-2.5 text-sm text-body hover:text-heading">
              Cancel
            </button>
          </div>
        </form>
      ) : posts === null ? (
        <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />
      ) : posts.length === 0 ? (
        <p className="rounded-2xl border border-line bg-white/[0.04] p-8 text-muted">No posts yet — create your first one.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white/[0.04] shadow-soft">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 last:border-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-heading font-semibold text-heading">{p.title}</span>
                  {!p.published && <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">Draft</span>}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">{fmt(p.published_at)} · {p.read_time || 3} min · /{p.slug}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => startEdit(p)} aria-label="Edit" className="rounded-lg p-2 text-muted hover:text-heading">
                  <Pencil size={16} />
                </button>
                <button onClick={() => remove(p)} aria-label="Delete" className="rounded-lg p-2 text-muted hover:text-coral">
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
