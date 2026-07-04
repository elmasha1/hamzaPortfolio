import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import AdminLayout from './AdminLayout'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Messages from './pages/Messages'
import Projects from './pages/Projects'
import Posts from './pages/Posts'
import Journey from './pages/Journey'
import About from './pages/About'
import Technologies from './pages/Technologies'
import Pricing from './pages/Pricing'
import Settings from './pages/Settings'
import Cv from './pages/Cv'

/**
 * AdminApp — routing for the dashboard (mounted at /admin/*).
 *
 *  - /admin                     → login page (public entry point)
 *  - /admin/dashboard           → Overview (protected)
 *  - /admin/messages|projects|settings → protected sections
 *
 * Everything except the login page is wrapped in ProtectedRoute, which sends
 * unauthenticated visitors back to /admin (the login page).
 */
export default function AdminApp() {
  return (
    <Routes>
      <Route index element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Overview />} />
        <Route path="messages" element={<Messages />} />
        <Route path="projects" element={<Projects />} />
        <Route path="posts" element={<Posts />} />
        <Route path="journey" element={<Journey />} />
        <Route path="technologies" element={<Technologies />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="about" element={<About />} />
        <Route path="cv" element={<Cv />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Any unknown /admin/* path → login page */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
