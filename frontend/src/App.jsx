import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'

// Code-split the two halves of the app so visitors to the public site never
// download the admin dashboard bundle (and vice-versa).
const SiteLayout = lazy(() => import('./layouts/SiteLayout'))
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const AdminApp = lazy(() => import('./admin/AdminApp'))
const CvPage = lazy(() => import('./CvPage'))
const ProjectDetail = lazy(() => import('./ProjectDetail'))
const NotFound = lazy(() => import('./NotFound'))

/** Minimal full-screen fallback while a route chunk loads (on-theme dark). */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
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
            path="/work/:id"
            element={
              <SettingsProvider>
                <ProjectDetail />
              </SettingsProvider>
            }
          />
          {/* Public site — shared chrome (nav/footer/cursor/smooth-scroll) with
              routed pages inside a smooth page transition. */}
          <Route
            element={
              <SettingsProvider>
                <SiteLayout />
              </SettingsProvider>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ToastProvider>
  )
}
