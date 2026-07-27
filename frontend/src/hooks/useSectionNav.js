import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { scrollToSelector, scrollToSelectorWhenReady } from '../lib/scroll'

/**
 * useSectionNav — jump to a section of the home scroll (#projects, #pricing,
 * #contact) from anywhere on the site. On home it just smooth-scrolls; from
 * another route it navigates home first, then scrolls once the route swap has
 * settled.
 *
 * Returns `(hash, event) => void` — pass the click event so the underlying
 * <a>/<Link> href stays real (openable in a new tab) but doesn't hard-navigate.
 */
export default function useSectionNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return useCallback(
    (hash, e) => {
      e?.preventDefault()
      if (pathname !== '/') {
        navigate('/')
        // The home chunk and its API-driven sections mount asynchronously.
        scrollToSelectorWhenReady(hash)
      } else {
        scrollToSelector(hash)
      }
    },
    [pathname, navigate]
  )
}
