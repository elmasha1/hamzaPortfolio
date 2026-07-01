import axios from 'axios'

// Centralised axios instance pointing at the Laravel API.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

/** GET /api/projects — returns the list of projects. */
export async function fetchProjects() {
  const { data } = await api.get('/projects')
  return data.data ?? data // supports both {data:[...]} and [...] responses
}

/** GET /api/projects/:id — a single project / case study. */
export async function fetchProject(id) {
  const { data } = await api.get(`/projects/${id}`)
  return data.data ?? data
}

/** POST /api/contact — stores a contact message. */
export async function sendContactMessage(payload) {
  const { data } = await api.post('/contact', payload)
  return data
}

/** GET /api/settings — public, dashboard-managed site settings. */
export async function fetchSettings() {
  const { data } = await api.get('/settings')
  return data.data ?? data
}

/** GET /api/cv — public CV / résumé data (for the /cv page and PDF). */
export async function fetchCv() {
  const { data } = await api.get('/cv')
  return data.data ?? data
}

/** GET /api/posts — published blog posts (list). */
export async function fetchPosts() {
  const { data } = await api.get('/posts')
  return data.data ?? data
}

/** GET /api/posts/:slug — a single published post. */
export async function fetchPost(slug) {
  const { data } = await api.get(`/posts/${slug}`)
  return data.data ?? data
}

/** GET /api/journey — "My Journey" timeline milestones (ordered). */
export async function fetchJourney() {
  const { data } = await api.get('/journey')
  return data.data ?? data
}

/** GET /api/about — About page content (headline, story, video, etc.). */
export async function fetchAbout() {
  const { data } = await api.get('/about')
  return data.data ?? data
}

export default api
