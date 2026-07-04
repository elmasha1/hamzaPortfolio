import { useRef, useState } from 'react'
import useUpload from '../../hooks/useUpload'
import { Trash2 } from '../../components/ui/Icons'

/**
 * ImageUploader — drag-and-drop / file-picker image field for the admin panel:
 * instant local preview, client-side validation (type + size), a visible
 * upload progress bar, and Replace / Remove actions on the current image.
 *
 * @param {string}   value      current image URL ('' = none)
 * @param {Function} uploadFn   (file, onProgress) => Promise<url payload>
 * @param {Function} onUploaded (payload) => void — called with the API result
 * @param {Function} onRemove   () => Promise<void>
 * @param {string}   alt        alt text for the preview image
 */
export default function ImageUploader({ value, uploadFn, onUploaded, onRemove, alt = 'Uploaded image' }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState('') // local object URL while uploading
  const [removing, setRemoving] = useState(false)
  const { upload, uploading, progress, error, setError } = useUpload(uploadFn)

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
        {/* Current / preview thumbnail */}
        <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-white/[0.02]">
          {shown ? (
            <img src={shown} alt={alt} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.12em] text-muted">
              No photo
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/70">
              <span className="text-xs font-medium text-heading">{progress}%</span>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-white transition-[width] duration-200" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image"
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
            {value ? 'Drop a new photo to replace' : 'Drag & drop your photo'}
          </p>
          <p className="mt-1 text-xs text-muted">or click to browse — JPG / PNG / WEBP, max 4 MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
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
            <Trash2 size={15} /> {removing ? 'Removing…' : 'Remove photo'}
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
