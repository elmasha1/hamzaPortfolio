import axios from 'axios'
import { COLD_START_TIMEOUT, installReadRetry } from './httpRetry'

// Centralised axios instance pointing at the Laravel API. The timeout and the
// read retry both exist to survive a cold start — see lib/httpRetry.js.
const api = installReadRetry(
  axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: COLD_START_TIMEOUT,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
)

/* ------------------------------------------------------------------ */
/* Client-side cache: in-memory TTL + in-flight request de-duplication.
   - Repeat navigation within STALE_MS is instant (no request at all).
   - Two components asking for the same path share ONE request (also
     guards React StrictMode double-mounted effects).                   */
/* ------------------------------------------------------------------ */
const STALE_MS = 5 * 60 * 1000 // 5 min
const cache = new Map() // path -> { data, expires }
const inflight = new Map() // path -> Promise

// Keys the /bootstrap payload seeds — if bootstrap is already in flight,
// these fetchers wait for it instead of firing their own request.
const BOOTSTRAP_KEYS = new Set(['/settings', '/projects', '/journey', '/technologies', '/pricing', '/about'])

async function cachedGet(path) {
  const hit = cache.get(path)
  if (hit && hit.expires > Date.now()) return hit.data

  if (inflight.has(path)) return inflight.get(path)

  if (BOOTSTRAP_KEYS.has(path) && inflight.has('/bootstrap')) {
    try {
      await inflight.get('/bootstrap') // its .then seeds this key on success
    } catch {
      /* fall through to a direct request */
    }
    // Re-enter: picks up the seeded cache, or dedupes a concurrent caller
    // (StrictMode double-mount) that started while we were waiting.
    return cachedGet(path)
  }

  const p = api
    .get(path)
    .then(({ data }) => {
      const value = data.data ?? data
      cache.set(path, { data: value, expires: Date.now() + STALE_MS })
      // Seed sub-keys HERE (not in fetchBootstrap) so anyone awaiting this
      // promise finds them already cached — no microtask race.
      if (path === '/bootstrap' && value && typeof value === 'object') {
        seedCache('/settings', value.settings)
        seedCache('/projects', value.projects)
        seedCache('/journey', value.journey)
        seedCache('/technologies', value.technologies)
        seedCache('/pricing', value.pricing)
        seedCache('/about', value.about)
      }
      return value
    })
    .finally(() => inflight.delete(path))

  inflight.set(path, p)
  return p
}

/** Seed the cache (used by the /bootstrap payload to pre-fill other keys). */
export function seedCache(path, data) {
  if (data !== undefined && data !== null) {
    cache.set(path, { data, expires: Date.now() + STALE_MS })
  }
}

/**
 * Clear the public data cache. Called after every successful admin write —
 * the dashboard and the public site are ONE SPA, so without this a client-side
 * navigation to a public page right after saving would show the pre-edit
 * payloads for up to 5 minutes.
 *
 * Also broadcasts the bust via localStorage so a public-site tab open in
 * ANOTHER tab of the same browser clears its own in-memory cache too
 * (`storage` events fire in every other tab).
 */
const BUST_KEY = 'public-cache-bust'

export function clearPublicCache() {
  cache.clear()
  try {
    localStorage.setItem(BUST_KEY, String(Date.now()))
  } catch {
    /* storage unavailable — same-tab clear still applied */
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === BUST_KEY) cache.clear()
  })
}

/* ----------------------------- fetchers ----------------------------- */

/** GET /api/bootstrap — everything the site needs on load, in ONE request.
    (Its response seeds the per-endpoint cache keys — see cachedGet.) */
export const fetchBootstrap = () => cachedGet('/bootstrap')

/** GET /api/projects — returns the list of projects. */
export const fetchProjects = () => cachedGet('/projects')

/** GET /api/projects/:id — a single project / case study. */
export const fetchProject = (id) => cachedGet(`/projects/${id}`)

/** GET /api/settings — public, dashboard-managed site settings. */
export const fetchSettings = () => cachedGet('/settings')

/** GET /api/cv — public CV / résumé data (for the /cv page and PDF). */
export const fetchCv = () => cachedGet('/cv')

/** GET /api/journey — "My Journey" timeline milestones (ordered). */
export const fetchJourney = () => cachedGet('/journey')

/** GET /api/about — About page content (headline, story, video, etc.). */
export const fetchAbout = () => cachedGet('/about')

/** GET /api/technologies — grouped tech stack (categories + items). */
export const fetchTechnologies = () => cachedGet('/technologies')

/** GET /api/pricing — pricing tiers + FAQ. */
export const fetchPricing = () => cachedGet('/pricing')

/** POST /api/contact — stores a contact message (never cached). */
export async function sendContactMessage(payload) {
  const { data } = await api.post('/contact', payload)
  return data
}

export default api
