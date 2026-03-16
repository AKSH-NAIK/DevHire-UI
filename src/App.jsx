import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider, useAuth } from './context/AuthContext'
import Loader from './components/Loader'

// Pages - Lazy loaded
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Jobs = lazy(() => import('./pages/Jobs'))
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'))
const PostJob = lazy(() => import('./pages/PostJob'))
const EditJob = lazy(() => import('./pages/EditJob'))
const CandidateDashboard = lazy(() => import('./pages/CandidateDashboard'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const FAQ = lazy(() => import('./pages/FAQ'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const RecruiterHelpGuide = lazy(() => import('./pages/RecruiterHelpGuide'))
const CandidateHelpGuide = lazy(() => import('./pages/CandidateHelpGuide'))

function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return <Loader fullScreen label="Authenticating..." size="lg" />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Loader fullScreen label="Loading page..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Recruiter Routes */}
            <Route
              path="/recruiter-dashboard"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter-help"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterHelpGuide />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-job"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-job/:jobId"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <EditJob />
                </ProtectedRoute>
              }
            />

            {/* Candidate Routes */}
            <Route
              path="/candidate-dashboard"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate-help"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <CandidateHelpGuide />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster position="top-center" reverseOrder={false} />
        <AppContent />
      </AuthProvider>
    </Router>
  )
}
