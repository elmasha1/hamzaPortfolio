import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { m } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { fetchSettings } from '../../lib/api'

export default function Login() {
  const { login, isAuthed } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin/dashboard'

  const [form, setForm] = useState({ email: 'admin@portfolio.test', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Wake the API while the password is still being typed. This page is the one
  // place in the app that asks for nothing on mount, so a sleeping container
  // used to start booting only at submit — turning the login itself into the
  // request that waits, or fails outright because a POST is never retried.
  useEffect(() => {
    fetchSettings().catch(() => {})
  }, [])

  // Already logged in? Bounce to the dashboard.
  if (isAuthed) return <Navigate to="/admin/dashboard" replace />

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      // Surface the real cause — never fail silently or mislabel a network
      // outage as "wrong credentials".
      let msg
      if (!err.response) {
        const api = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
        msg = `Cannot reach the server. Is the Laravel API running at ${api}?`
      } else if (err.response.status === 422) {
        msg = err.response.data?.errors?.email?.[0] || 'Please check your input.'
      } else if (err.response.status === 401) {
        msg = 'These credentials do not match our records.'
      } else if (err.response.status === 419) {
        msg = 'Session expired (CSRF). Please refresh and try again.'
      } else {
        msg = err.response.data?.message || 'Login failed. Please try again.'
      }
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const field =
    'w-full rounded-2xl border border-line bg-white/[0.04] px-4 py-3 text-heading outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15'

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-soft px-4">
      <m.div
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-3xl border border-line bg-white/[0.04] p-8 shadow-soft-lg"
      >
        <span className="font-heading text-2xl font-semibold text-heading">
          <span className="text-primary">&lt;</span>Hamza
          <span className="text-primary">/&gt;</span>
        </span>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-heading">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-muted">Manage projects, messages & settings.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="eyebrow mb-2 block">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              autoComplete="username"
              className={field}
            />
          </div>
          <div>
            <label className="eyebrow mb-2 block">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={field}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full px-6 py-3 disabled:opacity-60"
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              Sign in
            </span>
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          Seeded admin — email <code>admin@portfolio.test</code>, password{' '}
          <code>password</code>
        </p>
      </m.div>
    </div>
  )
}
