import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'

// Code-split the two halves of the app so visitors to the public site never
// download the admin dashboard bundle (and vice-versa).
const PublicSite = lazy(() => import('./PublicSite'))
const AdminApp = lazy(() => import('./admin/AdminApp'))
const CvPage = lazy(() => import('./CvPage'))

/** Minimal full-screen fallback while a route chunk loads. */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-soft">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    </div>
  )
}

/**
 * Top-level router.
 *  - /admin/*  → the admin dashboard (auth-protected inside AdminApp).
 *  - /*        → the public portfolio site.
 * Toasts are available everywhere.
 */
export default function App() {
  return (
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
          <Route
            path="/*"
            element={
              <SettingsProvider>
                <PublicSite />
              </SettingsProvider>
            }
          />
        </Routes>
      </Suspense>
    </ToastProvider>
  )
}
