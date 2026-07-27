import { useRef, useState } from 'react'
import useUpload from '../../hooks/useUpload'
import { Trash2 } from '../../components/ui/Icons'

const TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_MB = 50

/**
 * VideoUploader — drag-and-drop / file-picker video field for the admin panel.
 *
 * Mirrors ImageUploader: instant local preview, client-side validation, a
 * visible progress bar (videos take long enough that a silent wait reads as a
 * hang) and a Remove action.
 *
 * @param {string}   value      current video URL ('' = none)
 * @param {string}   poster     poster image URL, used for the preview frame
 * @param {Function} uploadFn   (file, onProgress) => Promise<{ video_url }>
 * @param {Function} onUploaded (payload) => void
 * @param {Function} onRemove   () => Promise<void>
 */
export default function VideoUploader({ value, poster, uploadFn, onUploaded, onRemove }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState('') // local object URL while uploading
  const [removing, setRemoving] = useState(false)
  const { upload, uploading, progress, error, setError } = useUpload(uploadFn, {
    maxMb: MAX_MB,
    types: TYPES,
    typeError: 'Please choose an MP4, WEBM or MOV video.',
    sizeError: `Video is too large — max ${MAX_MB} MB. Compress it before uploading.`,
  })

  const handleFile = async (file) => {
    if (!file) return
    const local = URL.createObjectURL(file)
    setPreview(local)
    const result = await upload(file)
    URL.revokeObjectURL(local)
    setPreview('')
    if (result) onUploaded?.(result)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleRemove = async () => {
    if (removing) return
    setRemoving(true)
    setError('')
    try {
      await onRemove?.()
    } finally {
      setRemoving(false)
    }
  }

  const shown = preview || value

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4">
        {/* Current / preview frame */}
        <div className="relative aspect-video w-44 shrink-0 overflow-hidden rounded-xl border border-line bg-white/[0.02]">
          {shown ? (
            <video
              key={shown}
              src={shown}
              poster={poster || undefined}
              muted
              playsInline
              preload="metadata"
              controls
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.12em] text-muted">
              No video
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/70">
              <span className="text-xs font-medium text-heading">{progress}%</span>
              <div className="h-1 w-24 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-white transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload video"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex min-h-28 flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition-colors ${
            dragOver ? 'border-primary bg-white/[0.06]' : 'border-line bg-white/[0.02] hover:bg-white/[0.04]'
          }`}
        >
          <p className="text-sm font-medium text-heading">
            {value ? 'Drop a new video to replace' : 'Drag & drop your video'}
          </p>
          <p className="mt-1 text-xs text-muted">
            or click to browse — MP4 / WEBM / MOV, max {MAX_MB} MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              handleFile(e.target.files?.[0])
              e.target.value = '' // allow re-selecting the same file
            }}
          />
        </div>
      </div>

      {/* Actions + errors */}
      <div className="flex items-center gap-4">
        {value && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-coral disabled:opacity-50"
          >
            <Trash2 size={15} /> {removing ? 'Removing…' : 'Remove video'}
          </button>
        )}
        {error && (
          <p role="alert" className="text-sm text-coral">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
