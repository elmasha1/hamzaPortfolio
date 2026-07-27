import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import { ToastProvider } from './context/ToastContext'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'

// Code-split the two halves of the app so visitors to the public site never
// download the admin dashboard bundle (and vice-versa).
const SiteLayout = lazy(() => import('./layouts/SiteLayout'))
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AdminApp = lazy(() => import('./admin/AdminApp'))
const CvPage = lazy(() => import('./CvPage'))
const ProjectDetail = lazy(() => import('./ProjectDetail'))
const NotFound = lazy(() => import('./NotFound'))

/** Minimal full-screen fallback while a route chunk loads (on-theme dark). */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
  )
}

/**
 * Top-level router.
 *  - /admin/*  → the admin dashboard (auth-protected inside AdminApp).
 *  - /*        → the public portfolio site.
 * Toasts are available everywhere.
 *
 * Every component animates through framer's `m` namespace inside a single
 * LazyMotion boundary, so only the DOM animation + gesture features ship —
 * layout projection and drag, which nothing here uses, stay out of the bundle.
 */
export default function App() {
  return (
    <LazyMotion features={domAnimation}>
      <ToastProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route
              path="/admin/*"
              element={
                <AuthProvider>
                  <AdminApp />
                </AuthProvider>
              }
            />
            <Route path="/cv" element={<CvPage />} />
            {/* Public site — shared chrome (nav/footer/cursor) with routed pages
                inside a smooth page transition. Case studies live here too: a
                visitor arriving from LinkedIn needs a way into the rest of the
                site. */}
            <Route
              element={
                <SettingsProvider>
                  <SiteLayout />
                </SettingsProvider>
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/work/:id" element={<ProjectDetail />} />
              {/* Retired pages — their content now lives on the home scroll, so
                  old links / bookmarks land on the matching section. */}
              <Route path="/contact" element={<Navigate to="/#contact" replace />} />
              <Route path="/pricing" element={<Navigate to="/#pricing" replace />} />
              <Route path="/projects" element={<Navigate to="/#projects" replace />} />
              <Route path="/blog" element={<Navigate to="/" replace />} />
              <Route path="/blog/:slug" element={<Navigate to="/" replace />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ToastProvider>
    </LazyMotion>
  )
}
