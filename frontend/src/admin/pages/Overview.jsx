import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowRight } from '../../components/ui/Icons'
import { overviewApi } from '../../lib/adminApi'

function StatCard({ label, value, accent, delay }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-2xl border border-line bg-white/[0.04] p-6 shadow-soft"
    >
      <p className="eyebrow">{label}</p>
      <p className={`mt-2 font-heading text-3xl font-semibold ${accent}`}>{value}</p>
    </m.div>
  )
}

export default function Overview() {
  const [stats, setStats] = useState({ messages: 0, unread: 0, projects: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    // ONE consolidated request (counts + recents) instead of downloading
    // every message and project just to show three numbers.
    overviewApi
      .get()
      .then((d) => {
        if (!alive || !d) return
        setStats({
          messages: d.counts?.messages ?? 0,
          unread: d.counts?.unread ?? 0,
          projects: d.counts?.projects ?? 0,
        })
        setRecent(d.recent_messages || [])
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white/[0.04] shadow-soft"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Total messages" value={stats.messages} accent="text-primary" delay={0} />
        <StatCard label="Unread" value={stats.unread} accent="text-coral" delay={0.06} />
        <StatCard label="Projects" value={stats.projects} accent="text-teal" delay={0.12} />
      </div>

      {/* Recent messages */}
      <div className="rounded-2xl border border-line bg-white/[0.04] p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-heading">
            Recent messages
          </h2>
          <Link to="/admin/messages" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-sm text-muted">No messages yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {recent.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3">
                {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-heading">
                    {m.name}{' '}
                    <span className="font-normal text-muted">&middot; {m.email}</span>
                  </p>
                  <p className="truncate text-sm text-body">{m.message}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
