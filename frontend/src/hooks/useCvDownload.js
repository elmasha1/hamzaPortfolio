import { useCallback, useState } from 'react'
import { fetchCv } from '../lib/api'
import { useToast } from '../context/ToastContext'

/**
 * useCvDownload — shared handler for every "Download CV" button. Fetches the
 * latest CV data, generates the PDF client-side and downloads it. Exposes a
 * `loading` flag for button spinners and surfaces errors via a toast.
 *
 * @param {object} [preloaded]  Optional already-fetched CV (skips the request).
 */
export default function useCvDownload(preloaded) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const download = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const cv = preloaded || (await fetchCv())
      // Load the jsPDF generator only on click so it never bloats the
      // initial page bundle.
      const { generateCvPdf } = await import('../lib/pdf')
      await generateCvPdf(cv)
    } catch (err) {
      toast.error('Could not generate the CV PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [loading, preloaded, toast])

  return { download, loading }
}
