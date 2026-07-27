import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projectsApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown } from '../../components/ui/Icons'
import ConfirmModal from '../components/ConfirmModal'

/* Build multipart FormData from the form state. */
function toFormData(form, file) {
  const fd = new FormData()
  fd.append('title', form.title)
  fd.append('description', form.description)
  fd.append('problem', form.problem || '')
  fd.append('architecture_notes', form.architecture_notes || '')
  fd.append('challenges', form.challenges || '')
  fd.append('outcome', form.outcome || '')
  fd.append('outcome_metric', form.outcome_metric || '')
  fd.append('key_features', JSON.stringify(form.key_features || []))
  fd.append('live_url', form.live_url || '')
  fd.append('github_url', form.github_url || '')
  fd.append('role', form.role || '')
  fd.append('featured', form.featured ? '1' : '0')
  fd.append('tech_tags', JSON.stringify(form.tech_tags))
  if (file) fd.append('image', file)
  else if (form.image) fd.append('image', form.image) // keep existing URL
  return fd
}

const EMPTY = {
  title: '',
  description: '',
  problem: '',
  architecture_notes: '',
  key_features: [],
  challenges: '',
  outcome: '',
  outcome_metric: '',
  tech_tags: [],
  live_url: '',
  github_url: '',
  role: '',
  featured: false,
  image: '',
}

/* ---- Create/Edit form (slide-over modal) ---- */
function ProjectForm({ initial, onClose, onSaved }) {
  const toast = useToast()
  const [form, setForm] = useState(initial || EMPTY)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(initial?.image || '')
  const [tagInput, setTagInput] = useState('')
  const [featInput, setFeatInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const addFeature = (e) => {
    e.preventDefault()
    const t = featInput.trim()
    const list = form.key_features || []
    if (t && !list.includes(t)) set('key_features', [...list, t])
    setFeatInput('')
  }
  const removeFeature = (t) =>
    set('key_features', (form.key_features || []).filter((x) => x !== t))

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const addTag = (e) => {
    e.preventDefault()
    const t = tagInput.trim()
    if (t && !form.tech_tags.includes(t)) set('tech_tags', [...form.tech_tags, t])
    setTagInput('')
  }
  const removeTag = (t) =>
    set('tech_tags', form.tech_tags.filter((x) => x !== t))

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const fd = toFormData(form, file)
      const saved = initial?.id
        ? await projectsApi.update(initial.id, fd)
        : await projectsApi.create(fd)
      toast.success(initial?.id ? 'Project updated.' : 'Project created.')
      onSaved(saved)
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
        toast.error('Please fix the highlighted fields.')
      } else {
        toast.error('Save failed.')
      }
    } finally {
      setSaving(false)
    }
  }

  const field =
    'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <motion.div
      className="fixed inset-0 z-[115] flex justify-end bg-dark/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        initial={{ x: 460 }}
        animate={{ x: 0 }}
        exit={{ x: 460 }}
        transition={{ type: 'spring', stiffness: 280, damping: 30 }}
        className="h-full w-full max-w-md overflow-y-auto bg-white/[0.04] p-6 shadow-soft-lg"
      >
        <h2 className="font-heading text-xl font-semibold text-heading">
          {initial?.id ? 'Edit project' : 'New project'}
        </h2>

        {/* Image upload + preview */}
        <div className="mt-5">
          <label className="eyebrow mb-2 block">Screenshot</label>
          <div className="overflow-hidden rounded-xl border border-line">
            {preview ? (
              <img src={preview} alt="" className="aspect-[16/10] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-base-indigo text-sm text-muted">
                No image
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={onFile} className="mt-2 text-sm text-body" />
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <label className="eyebrow mb-1 block">Title</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} className={field} required />
            {errors.title && <p className="mt-1 text-xs text-coral">{errors.title[0]}</p>}
          </div>

          <div>
            <label className="eyebrow mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className={`${field} resize-none`} required />
            {errors.description && <p className="mt-1 text-xs text-coral">{errors.description[0]}</p>}
          </div>

          <div>
            <label className="eyebrow mb-1 block">My role</label>
            <input value={form.role} onChange={(e) => set('role', e.target.value)} className={field} placeholder="e.g. Lead full-stack developer" />
          </div>

          {/* ---- Engineering case study ---- */}
          <div className="!mt-5 border-t border-line pt-4">
            <p className="eyebrow mb-3 block text-primary">Case study</p>
          </div>

          <div>
            <label className="eyebrow mb-1 block">Problem</label>
            <textarea value={form.problem} onChange={(e) => set('problem', e.target.value)} rows={3} className={`${field} resize-none`} placeholder="What problem did this solve, and for whom?" />
          </div>

          <div>
            <label className="eyebrow mb-1 block">Approach & architecture</label>
            <textarea value={form.architecture_notes} onChange={(e) => set('architecture_notes', e.target.value)} rows={3} className={`${field} resize-none`} placeholder="e.g. React SPA + Laravel REST API, MySQL, Sanctum auth, queued jobs…" />
          </div>

          {/* Key features */}
          <div>
            <label className="eyebrow mb-1 block">Key features</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {(form.key_features || []).map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full border border-line bg-white/[0.05] px-3 py-1 text-xs font-medium text-primary-300">
                  {t}
                  <button type="button" onClick={() => removeFeature(t)} className="text-muted hover:text-coral">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={featInput}
                onChange={(e) => setFeatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFeature(e)}
                className={field}
                placeholder="Type a feature, press Enter"
              />
              <button type="button" onClick={addFeature} className="rounded-xl border border-line px-3 text-sm">Add</button>
            </div>
          </div>

          <div>
            <label className="eyebrow mb-1 block">Challenges</label>
            <textarea value={form.challenges} onChange={(e) => set('challenges', e.target.value)} rows={2} className={`${field} resize-none`} placeholder="Hardest technical problems you solved" />
          </div>

          <div>
            <label className="eyebrow mb-1 block">Outcome & impact</label>
            <textarea value={form.outcome} onChange={(e) => set('outcome', e.target.value)} rows={2} className={`${field} resize-none`} placeholder="Measurable result, e.g. reduced load time 40%" />
          </div>

          <div>
            <label className="eyebrow mb-1 block">Outcome figure (work index)</label>
            <input value={form.outcome_metric} onChange={(e) => set('outcome_metric', e.target.value)} className={field} placeholder="−38% dispatch time" maxLength={80} />
            <p className="mt-1 text-xs text-muted">
              Short and numeric — it prints at the right edge of this project&rsquo;s row in Selected work.
            </p>
          </div>

          <div className="!mt-5 border-t border-line pt-4" />

          {/* Tech tags */}
          <div>
            <label className="eyebrow mb-1 block">Tech tags</label>
            <div className="mb-2 flex flex-wrap gap-2">
              {form.tech_tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-full border border-line bg-white/[0.05] px-3 py-1 text-xs font-medium text-primary-300">
                  {t}
                  <button type="button" onClick={() => removeTag(t)} className="text-muted hover:text-coral">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
                className={field}
                placeholder="Type a tag, press Enter"
              />
              <button type="button" onClick={addTag} className="rounded-xl border border-line px-3 text-sm">Add</button>
            </div>
          </div>

          <div>
            <label className="eyebrow mb-1 block">Live URL</label>
            <input value={form.live_url} onChange={(e) => set('live_url', e.target.value)} className={field} placeholder="https://..." />
            {errors.live_url && <p className="mt-1 text-xs text-coral">{errors.live_url[0]}</p>}
          </div>
          <div>
            <label className="eyebrow mb-1 block">GitHub URL</label>
            <input value={form.github_url} onChange={(e) => set('github_url', e.target.value)} className={field} placeholder="https://github.com/..." />
            {errors.github_url && <p className="mt-1 text-xs text-coral">{errors.github_url[0]}</p>}
          </div>

          <label className="flex cursor-pointer items-center gap-3 pt-1">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="h-4 w-4 accent-white" />
            <span className="text-sm font-medium text-heading">Featured project</span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-body">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 px-4 py-2.5 text-sm disabled:opacity-60">
            <span className="relative z-10 inline-flex items-center gap-2">
              {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/70" />}
              Save
            </span>
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

/* ---- Projects list page ---- */
export default function Projects() {
  const toast = useToast()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // project | {} for new | null
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    projectsApi.list().then(setProjects).catch(() => toast.error('Could not load projects.')).finally(() => setLoading(false))
  }
  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onSaved = () => {
    setEditing(null)
    load()
  }

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await projectsApi.remove(toDelete.id)
      setProjects((p) => p.filter((x) => x.id !== toDelete.id))
      toast.success('Project deleted.')
      setToDelete(null)
    } catch {
      toast.error('Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  // Move a card up/down and persist the new order.
  const move = async (index, dir) => {
    const next = [...projects]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setProjects(next)
    try {
      await projectsApi.reorder(next.map((p) => p.id))
    } catch {
      toast.error('Reorder failed.')
      load()
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-heading">
          Projects
        </h2>
        <button onClick={() => setEditing({})} className="btn-primary px-4 py-2.5 text-sm">
          <span className="relative z-10 inline-flex items-center gap-2">
            <Plus size={16} /> New project
          </span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/[0.04] shadow-soft" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-10 text-center text-sm text-muted">
          No projects yet — create your first one.
        </p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p, i) => (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-line bg-white/[0.04] p-3 shadow-soft"
            >
              {/* Reorder */}
              <div className="flex flex-col">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-muted disabled:opacity-30 hover:text-primary" aria-label="Move up">
                  <ChevronUp size={16} />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === projects.length - 1} className="text-muted disabled:opacity-30 hover:text-primary" aria-label="Move down">
                  <ChevronDown size={16} />
                </button>
              </div>

              <img
                src={p.image}
                alt=""
                loading="lazy"
                className="h-14 w-20 shrink-0 rounded-lg object-cover"
                onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
              />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate font-medium text-heading">
                  {p.title}
                  {p.featured && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Featured
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-muted">
                  {(p.tech_tags || []).join(' · ')}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button onClick={() => setEditing(p)} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm text-body transition hover:bg-base-indigo">
                  <Pencil size={15} /> Edit
                </button>
                <button onClick={() => setToDelete(p)} className="inline-flex items-center gap-1.5 rounded-lg bg-coral/10 px-3 py-1.5 text-sm text-coral transition hover:bg-coral/20">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {editing && (
          <ProjectForm
            initial={editing.id ? editing : null}
            onClose={() => setEditing(null)}
            onSaved={onSaved}
          />
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!toDelete}
        title="Delete project?"
        message={`"${toDelete?.title}" will be permanently removed.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
