import { useEffect, useState } from 'react'
import { accountApi } from '../../lib/adminApi'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const field =
  'w-full rounded-xl border border-line bg-white/[0.04] px-3 py-2 text-sm text-heading outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

/**
 * AccountSection — the signed-in admin's own name, email and password.
 *
 * The account this site ships with has a password published in the repository,
 * so changing it has to be possible from the dashboard: the host has no shell,
 * and there is no other way in.
 *
 * Its own form, submitted on its own — the surrounding Settings page saves
 * site content, and a credential change should never ride along with that by
 * accident.
 */
export default function AccountSection() {
  const { user } = useAuth()
  const toast = useToast()

  const [form, setForm] = useState({
    name: '',
    email: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  // Fill in from the session once it has loaded.
  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name || '', email: user.email || '' }))
  }, [user])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setErrors({})

    if (form.password && form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: ['The two passwords do not match.'] })
      return
    }

    setSaving(true)
    try {
      const res = await accountApi.update(form)
      toast.success(res.message || 'Account updated.')
      // Never leave a typed password sitting in component state.
      setForm((f) => ({ ...f, current_password: '', password: '', password_confirmation: '' }))
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
        toast.error('Please fix the highlighted fields.')
      } else {
        toast.error('Could not update the account.')
      }
    } finally {
      setSaving(false)
    }
  }

  const Error = ({ name }) =>
    errors[name] ? <p className="mt-1 text-xs text-coral">{errors[name][0]}</p> : null

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-white/[0.04] p-6 shadow-soft"
    >
      <h3 className="mb-1 font-heading text-lg font-semibold text-heading">Your account</h3>
      <p className="mb-4 text-sm text-muted">
        The login for this dashboard. Saved on its own — the button below does not touch any of
        the site content.
      </p>

      <div className="space-y-3">
        <label className="block">
          <span className="eyebrow mb-1 block">Name</span>
          <input value={form.name} onChange={(e) => set('name', e.target.value)} className={field} autoComplete="name" />
          <Error name="name" />
        </label>

        <label className="block">
          <span className="eyebrow mb-1 block">Email (this is your username)</span>
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={field} autoComplete="username" />
          <Error name="email" />
        </label>

        <div className="!mt-5 border-t border-line pt-4">
          <p className="text-sm text-muted">
            Leave the password fields empty to keep your current password.
          </p>
        </div>

        <label className="block">
          <span className="eyebrow mb-1 block">Current password</span>
          <input
            type="password"
            value={form.current_password}
            onChange={(e) => set('current_password', e.target.value)}
            className={field}
            autoComplete="current-password"
            placeholder="Required only when changing the password"
          />
          <Error name="current_password" />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="eyebrow mb-1 block">New password</span>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              className={field}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
            <Error name="password" />
          </label>
          <label className="block">
            <span className="eyebrow mb-1 block">Repeat new password</span>
            <input
              type="password"
              value={form.password_confirmation}
              onChange={(e) => set('password_confirmation', e.target.value)}
              className={field}
              autoComplete="new-password"
            />
            <Error name="password_confirmation" />
          </label>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60">
          {saving ? 'Saving…' : 'Update account'}
        </button>
        {form.password && (
          <p className="text-xs text-muted">
            Changing your password signs out every other device.
          </p>
        )}
      </div>
    </form>
  )
}
