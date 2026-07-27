import { useEffect } from 'react'

/** The title index.html ships with — what every route falls back to. */
export const DEFAULT_TITLE = 'EL MASDOUKI Hamza — Full Stack Engineer'

/**
 * useDocumentTitle — set the tab title for a route and put it back on the way
 * out.
 *
 * Without the restore, a client-side navigation away from a case study left
 * "Atlas — Case study" in the tab (and in the history entry, and in whatever
 * the visitor bookmarks) for every page after it.
 *
 * Passing a falsy title is a no-op, so a component can call this before its
 * data has arrived.
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return
    document.title = title
    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [title])
}
