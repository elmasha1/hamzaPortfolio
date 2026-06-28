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

export default api
