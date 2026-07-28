import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import AdminErrorBoundary from './components/AdminErrorBoundary'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  LayoutDashboard,
  Inbox,
  FolderKanban,
  FileText,
  Settings,
  LogOut,
  Menu,
  ArrowUpRight,
  GitBranch,
  Eye,
  LayoutGrid,
  Tag,
} from '../components/ui/Icons'

const NAV = [
  { to: '/admin/dashboard', label: 'Overview', end: true, Icon: LayoutDashboard },
  { to: '/admin/messages', label: 'Messages', Icon: Inbox },
  { to: '/admin/projects', label: 'Projects', Icon: FolderKanban },
  { to: '/admin/journey', label: 'Journey', Icon: GitBranch },
  { to: '/admin/technologies', label: 'Technologies', Icon: LayoutGrid },
  { to: '/admin/pricing', label: 'Ways to work', Icon: Tag },
  { to: '/admin/about', label: 'About page', Icon: Eye },
  { to: '/admin/cv', label: 'CV / Resume', Icon: FileText },
  { to: '/admin/settings', label: 'Settings', Icon: Settings },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false) // mobile sidebar

  const handleLogout = async () => {
    await logout()
    toast.info('Signed out.')
    navigate('/admin')
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <span className="font-heading text-xl font-semibold text-heading">
          <span className="text-primary">&lt;</span>Hamza
          <span className="text-primary">/&gt;</span>
        </span>
        <p className="eyebrow mt-1">Admin</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-body hover:bg-base-indigo'
              }`
            }
          >
            <n.Icon size={18} />
            {n.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="m-3 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-coral transition-colors hover:bg-coral/10"
      >
        <LogOut size={18} /> Log out
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-base-soft">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white/[0.04] lg:block">
        {SidebarContent}
      </aside>

      {/* Sidebar (mobile drawer) */}
      <AnimatePresence>
        {open && (
          <>
            <m.div
              className="fixed inset-0 z-40 bg-dark/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <m.aside
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-line bg-white/[0.04] lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {SidebarContent}
            </m.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/[0.06] px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="rounded-lg border border-line p-2 text-heading lg:hidden"
            >
              <Menu size={18} />
            </button>
            <h1 className="font-heading text-lg font-semibold text-heading">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden items-center gap-1 text-sm font-medium text-muted hover:text-primary sm:inline-flex"
            >
              View site <ArrowUpRight size={16} />
            </a>
            <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white sm:flex">
              {user?.name?.[0] ?? 'A'}
            </span>
          </div>
        </header>

        {/* Page content.
            No exit animation and no AnimatePresence "wait": those made the
            outgoing page fade out completely before the incoming one mounted,
            so every link click showed an empty content area for about half a
            second. The new section now renders immediately and just fades in. */}
        <main className="p-5 sm:p-8">
          <AdminErrorBoundary resetKey={location.pathname}>
            <m.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </m.div>
          </AdminErrorBoundary>
        </main>
      </div>
    </div>
  )
}
