import { useEffect, useState } from 'react'
import { aboutApi, aboutVideoApi } from '../../lib/adminApi'
import { useToast } from '../../context/ToastContext'
import { Plus, X } from '../../components/ui/Icons'
import VideoUploader from '../components/VideoUploader'

const field =
  'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.04] p-6 shadow-soft">
      <h3 className="mb-4 font-heading text-lg font-semibold text-heading">{title}</h3>
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

const EMPTY = {
  headline: '',
  subline: '',
  video_url: '',
  video_poster: '',
  video_caption: '',
  story: [],
  pull_quote: '',
  philosophy: [],
  facts: [],
}

export default function About() {
  const toast = useToast()
  const [a, setA] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    aboutApi
      .get()
      .then((d) => setA({ ...EMPTY, ...d, story: d.story || [], philosophy: d.philosophy || [], facts: d.facts || [] }))
      .catch(() => toast.error('Could not load About content.'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setA((p) => ({ ...p, [k]: v }))

  // story (array of strings)
  const setStory = (i, v) => setA((p) => { const story = [...p.story]; story[i] = v; return { ...p, story } })
  const addStory = () => set('story', [...a.story, ''])
  const removeStory = (i) => set('story', a.story.filter((_, idx) => idx !== i))

  // philosophy
  const setPhil = (i, k, v) => setA((p) => { const philosophy = [...p.philosophy]; philosophy[i] = { ...philosophy[i], [k]: v }; return { ...p, philosophy } })
  const addPhil = () => set('philosophy', [...a.philosophy, { title: '', description: '' }])
  const removePhil = (i) => set('philosophy', a.philosophy.filter((_, idx) => idx !== i))

  // facts
  const setFact = (i, k, v) => setA((p) => {
    const facts = [...p.facts]
    facts[i] = { ...facts[i], [k]: k === 'value' ? (v === '' ? '' : Number(v)) : v }
    return { ...p, facts }
  })
  const addFact = () => set('facts', [...a.facts, { label: '', value: 0, suffix: '+' }])
  const removeFact = (i) => set('facts', a.facts.filter((_, idx) => idx !== i))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Drop empty value on text-only facts so validation passes.
      const payload = {
        ...a,
        facts: a.facts.map((f) => (f.text ? { label: f.label, text: f.text } : { label: f.label, value: Number(f.value) || 0, suffix: f.suffix || '' })),
      }
      await aboutApi.update(payload)
      toast.success('About page saved.')
    } catch {
      toast.error('Save failed.')
    } finally {
      setSaving(false)
    }
  }

  if (!a) return <div className="h-64 animate-pulse rounded-2xl bg-white/[0.04]" />

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-heading">About page</h2>
        <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <Section title="Intro">
        <Labeled label="Headline"><input value={a.headline} onChange={(e) => set('headline', e.target.value)} className={field} /></Labeled>
        <Labeled label="Subline"><textarea value={a.subline} onChange={(e) => set('subline', e.target.value)} rows={2} className={`${field} resize-none`} /></Labeled>
      </Section>

      <Section title="Story video">
        <Labeled label="Upload a video">
          <VideoUploader
            value={a.video_url}
            poster={a.video_poster}
            uploadFn={aboutVideoApi.upload}
            onUploaded={(d) => {
              set('video_url', d.video_url)
              toast.success('Video uploaded — it now shows inside the story.')
            }}
            onRemove={async () => {
              try {
                await aboutVideoApi.remove()
                set('video_url', '')
                toast.success('Video removed — the placeholder frame will show.')
              } catch {
                toast.error('Could not remove the video.')
              }
            }}
          />
        </Labeled>
        <p className="text-xs text-muted">
          Uploading saves straight away — you don&rsquo;t need to press Save changes for the video
          itself. Or paste a URL below if the file is hosted elsewhere.
        </p>
        <Labeled label="Video URL (or paste an external one)"><input value={a.video_url} onChange={(e) => set('video_url', e.target.value)} className={field} placeholder="/assets/intro.mp4 or https://…" /></Labeled>
        <Labeled label="Poster image URL"><input value={a.video_poster} onChange={(e) => set('video_poster', e.target.value)} className={field} placeholder="https://… or /assets/poster.jpg" /></Labeled>
        <Labeled label="Caption (mono, under the video)"><input value={a.video_caption} onChange={(e) => set('video_caption', e.target.value)} className={field} placeholder="Ninety seconds on how I work" maxLength={200} /></Labeled>
        <p className="text-xs text-muted">The video sits inside the story as a figure — it illustrates the page rather than opening it.</p>
      </Section>

      <Section title="My story (paragraphs)">
        {a.story.map((para, i) => (
          <div key={i} className="relative">
            <textarea value={para} onChange={(e) => setStory(i, e.target.value)} rows={3} className={`${field} resize-none pr-9`} placeholder={`Paragraph ${i + 1}`} />
            <button type="button" onClick={() => removeStory(i)} aria-label="Remove paragraph" className="absolute right-2 top-2 text-muted hover:text-coral"><X size={16} /></button>
          </div>
        ))}
        <button type="button" onClick={addStory} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"><Plus size={16} /> Add paragraph</button>
        <Labeled label="Pull quote (oversized, between paragraphs)"><input value={a.pull_quote} onChange={(e) => set('pull_quote', e.target.value)} className={field} /></Labeled>
      </Section>

      <Section title="How I decide">
        {a.philosophy.map((p, i) => (
          <div key={i} className="relative rounded-xl border border-line bg-white/[0.02] p-4">
            <button type="button" onClick={() => removePhil(i)} aria-label="Remove" className="absolute right-3 top-3 text-muted hover:text-coral"><X size={16} /></button>
            <div className="space-y-3 pr-6">
              <input value={p.title} onChange={(e) => setPhil(i, 'title', e.target.value)} className={field} placeholder="The opinion (e.g. Boring technology, aggressively)" />
              <textarea value={p.description} onChange={(e) => setPhil(i, 'description', e.target.value)} rows={2} className={`${field} resize-none`} placeholder="Its consequence — the ‘because…’ half" />
            </div>
          </div>
        ))}
        <button type="button" onClick={addPhil} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"><Plus size={16} /> Add position</button>
      </Section>

      <Section title="Quick facts (no longer shown on About)">
        {a.facts.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={f.label} onChange={(e) => setFact(i, 'label', e.target.value)} className={field} placeholder="Label" />
            <input value={f.value ?? ''} onChange={(e) => setFact(i, 'value', e.target.value)} type="number" className="w-24 rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm" placeholder="00" />
            <input value={f.suffix ?? ''} onChange={(e) => setFact(i, 'suffix', e.target.value)} className="w-16 rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm" placeholder="+" />
            <input value={f.text ?? ''} onChange={(e) => setFact(i, 'text', e.target.value)} className={field} placeholder="…or text (e.g. Rabat)" />
            <button type="button" onClick={() => removeFact(i)} className="px-2 text-muted hover:text-coral" aria-label="Remove fact"><X size={16} /></button>
          </div>
        ))}
        <p className="text-xs text-muted">These moved to the proof strip under the home hero — edit them in <span className="font-medium text-heading">Settings → Proof strip</span>. Anything kept here is stored but not displayed.</p>
        <button type="button" onClick={addFact} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"><Plus size={16} /> Add fact</button>
      </Section>

      <p className="text-sm text-muted">Skills groups are managed under <span className="font-medium text-heading">Settings → Technologies</span>.</p>
    </form>
  )
}
