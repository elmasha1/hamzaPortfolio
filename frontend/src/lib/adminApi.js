import axios from 'axios'
import { clearPublicCache } from './api'
import { COLD_START_TIMEOUT, installReadRetry } from './httpRetry'

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

// Same cold-start handling as the public client. Without a timeout the
// dashboard hung on a sleeping API, and without the retry a refused
// connection surfaced as "cannot reach the server" for a server that was
// simply waking up.
const adminApi = installReadRetry(
  axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: COLD_START_TIMEOUT,
    headers: { Accept: 'application/json' },
  })
)

// Attach the bearer token on every request.
adminApi.interceptors.request.use((config) => {
  const token = tokenStore.get()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ------------------------------------------------------------------ */
/* Admin GET cache: TTL + in-flight de-duplication, so navigating       */
/* between admin pages is instant. ANY successful admin write clears    */
/* it (and the public cache), so data is never stale after a save.      */
/* ------------------------------------------------------------------ */
const ADMIN_STALE_MS = 2 * 60 * 1000 // 2 min
const adminCache = new Map() // path -> { data, expires }
const adminInflight = new Map() // path -> Promise

function cachedAdminGet(path) {
  const hit = adminCache.get(path)
  if (hit && hit.expires > Date.now()) return Promise.resolve(hit.data)
  if (adminInflight.has(path)) return adminInflight.get(path)

  const p = adminApi
    .get(path)
    .then((r) => {
      adminCache.set(path, { data: r.data, expires: Date.now() + ADMIN_STALE_MS })
      return r.data
    })
    .finally(() => adminInflight.delete(path))

  adminInflight.set(path, p)
  return p
}

export function clearAdminCache() {
  adminCache.clear()
}

// Global 401 handling: drop the token (ProtectedRoute will redirect).
// Also: any successful WRITE invalidates BOTH client caches (admin + public),
// so every page — dashboard or site — re-fetches fresh content after a save.
adminApi.interceptors.response.use(
  (res) => {
    const method = (res.config?.method || '').toLowerCase()
    if (method && method !== 'get') {
      clearPublicCache()
      clearAdminCache()
    }
    return res
  },
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

/* --------------------------- Overview --------------------------- */
export const overviewApi = {
  get: () => cachedAdminGet('/admin/overview').then((d) => d.data),
}

/* ------------------------- Profile photo ------------------------ */
export const photoApi = {
  upload: (file, onProgress) => {
    const form = new FormData()
    form.append('photo', file)
    return adminApi
      .post('/admin/profile-photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      .then((r) => r.data.data)
  },
  remove: () => adminApi.delete('/admin/profile-photo').then((r) => r.data.data),
}

/* ------------------ CV photo (dedicated, formal) ----------------- */
export const cvPhotoApi = {
  upload: (file, onProgress) => {
    const form = new FormData()
    form.append('photo', file)
    return adminApi
      .post('/admin/cv-photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      .then((r) => r.data.data)
  },
  remove: () => adminApi.delete('/admin/cv-photo').then((r) => r.data.data),
}

/* --------------------------- Messages --------------------------- */
export const messagesApi = {
  list: (page = 1) => cachedAdminGet(`/admin/messages?page=${page}`),
  setRead: (id, read) =>
    adminApi.patch(`/admin/messages/${id}`, { read }).then((r) => r.data),
  remove: (id) => adminApi.delete(`/admin/messages/${id}`).then((r) => r.data),
}

/* --------------------------- Projects --------------------------- */
export const projectsApi = {
  list: () => cachedAdminGet('/admin/projects').then((d) => d.data),
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

/* --------------------- Case-study hero video -------------------------- */
export const projectVideoApi = {
  upload: (id, file, onProgress) => {
    const form = new FormData()
    form.append('video', file)
    return adminApi
      .post(`/admin/projects/${id}/video`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      .then((r) => r.data.data)
  },
  remove: (id) => adminApi.delete(`/admin/projects/${id}/video`).then((r) => r.data.data),
}

/* ------------------------- About story video -------------------------- */
export const aboutVideoApi = {
  upload: (file, onProgress) => {
    const form = new FormData()
    form.append('video', file)
    return adminApi
      .post('/admin/about-video', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      .then((r) => r.data.data)
  },
  remove: () => adminApi.delete('/admin/about-video').then((r) => r.data.data),
}

/* -------------------------- Own account -------------------------- */
export const accountApi = {
  update: (payload) => adminApi.put('/admin/account', payload).then((r) => r.data),
}

/* ---------------------------- About ----------------------------- */
export const aboutApi = {
  get: () => cachedAdminGet('/admin/about').then((d) => d.data),
  update: (payload) => adminApi.put('/admin/about', payload).then((r) => r.data.data),
}

/* ------------------------- Technologies ------------------------- */
export const technologiesApi = {
  get: () => cachedAdminGet('/admin/technologies').then((d) => d.data),
  update: (groups) => adminApi.put('/admin/technologies', { groups }).then((r) => r.data.data),
}

/* ---------------------------- Pricing ---------------------------- */
export const pricingApi = {
  get: () => cachedAdminGet('/admin/pricing').then((d) => d.data),
  update: (payload) => adminApi.put('/admin/pricing', payload).then((r) => r.data.data),
}

/* --------------------------- Journey ---------------------------- */
export const journeyApi = {
  list: () => cachedAdminGet('/admin/journey').then((d) => d.data),
  create: (payload) => adminApi.post('/admin/journey', payload).then((r) => r.data.data),
  update: (id, payload) => adminApi.put(`/admin/journey/${id}`, payload).then((r) => r.data.data),
  remove: (id) => adminApi.delete(`/admin/journey/${id}`).then((r) => r.data),
  reorder: (ids) => adminApi.post('/admin/journey/reorder', { order: ids }).then((r) => r.data),
}

/* --------------------------- Settings --------------------------- */
export const settingsApi = {
  get: () => cachedAdminGet('/admin/settings').then((d) => d.data),
  update: (settings) =>
    adminApi.put('/admin/settings', { settings }).then((r) => r.data.data),
}

/* ------------------------------ CV ------------------------------ */
export const cvApi = {
  get: () => cachedAdminGet('/admin/cv').then((d) => d.data),
  update: (cv) => adminApi.put('/admin/cv', { cv }).then((r) => r.data.data),
}

export default adminApi
