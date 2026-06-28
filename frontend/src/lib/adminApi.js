import axios from 'axios'

/**
 * Axios instance for the admin dashboard. Automatically attaches the stored
 * Sanctum bearer token, and on a 401 clears the token so the UI can redirect
 * to the login page.
 */
const TOKEN_KEY = 'admin_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
})

// Attach the bearer token on every request.
adminApi.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global 401 handling: drop the token (ProtectedRoute will redirect).
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      tokenStore.clear()
      // Redirect back to the login page (/admin) unless we're already there.
      if (!window.location.pathname.endsWith('/admin')) {
        window.location.assign('/admin')
      }
    }
    return Promise.reject(err)
  }
)

/* ----------------------------- Auth ----------------------------- */
export const authApi = {
  login: (payload) => adminApi.post('/login', payload).then((r) => r.data),
  me: () => adminApi.get('/me').then((r) => r.data),
  logout: () => adminApi.post('/logout').then((r) => r.data),
}

/* --------------------------- Messages --------------------------- */
export const messagesApi = {
  list: () => adminApi.get('/admin/messages').then((r) => r.data),
  setRead: (id, read) =>
    adminApi.patch(`/admin/messages/${id}`, { read }).then((r) => r.data),
  remove: (id) => adminApi.delete(`/admin/messages/${id}`).then((r) => r.data),
}

/* --------------------------- Projects --------------------------- */
export const projectsApi = {
  list: () => adminApi.get('/admin/projects').then((r) => r.data.data),
  create: (formData) =>
    adminApi
      .post('/admin/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data),
  update: (id, formData) =>
    adminApi
      // Use POST + _method=PUT so multipart file uploads work on update.
      .post(`/admin/projects/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data.data),
  remove: (id) => adminApi.delete(`/admin/projects/${id}`).then((r) => r.data),
  reorder: (ids) =>
    adminApi.post('/admin/projects/reorder', { order: ids }).then((r) => r.data),
}

/* --------------------------- Settings --------------------------- */
export const settingsApi = {
  get: () => adminApi.get('/admin/settings').then((r) => r.data.data),
  update: (settings) =>
    adminApi.put('/admin/settings', { settings }).then((r) => r.data.data),
}

/* ------------------------------ CV ------------------------------ */
export const cvApi = {
  get: () => adminApi.get('/admin/cv').then((r) => r.data.data),
  update: (cv, profilePhoto) =>
    adminApi
      .put('/admin/cv', { cv, profile_photo: profilePhoto })
      .then((r) => r.data.data),
}

export default adminApi
