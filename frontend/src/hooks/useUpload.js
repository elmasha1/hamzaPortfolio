import { useCallback, useRef, useState } from 'react'

/**
 * useUpload — client-side validation + upload state for image uploads.
 *
 * @param {(file: File, onProgress: (pct: number) => void) => Promise<any>} uploadFn
 * @param {{ maxMb?: number, types?: string[] }} [opts]
 * @returns {{ upload, uploading, progress, error, setError }}
 */
const DEFAULT_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function useUpload(uploadFn, { maxMb = 4, types = DEFAULT_TYPES } = {}) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const busy = useRef(false)

  const upload = useCallback(
    async (file) => {
      if (!file || busy.current) return null
      setError('')

      if (!types.includes(file.type)) {
        setError('Please choose a JPG, PNG or WEBP image.')
        return null
      }
      if (file.size > maxMb * 1024 * 1024) {
        setError(`Image is too large — max ${maxMb} MB.`)
        return null
      }

      busy.current = true
      setUploading(true)
      setProgress(0)
      try {
        return await uploadFn(file, setProgress)
      } catch (e) {
        setError(
          e?.response?.data?.message || 'Upload failed — check your connection and try again.'
        )
        return null
      } finally {
        busy.current = false
        setUploading(false)
      }
    },
    [uploadFn, maxMb, types]
  )

  return { upload, uploading, progress, error, setError }
}
