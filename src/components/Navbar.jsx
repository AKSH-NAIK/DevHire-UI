import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard, HelpCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMobileMenuOpen(false)
  }

  const dashboardPath = user?.role === 'admin'
    ? '/admin-dashboard'
    : user?.role === 'recruiter'
      ? '/recruiter-dashboard'
      : '/candidate-dashboard'

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="DevHire Home">
            <div className="flex h-8 w-8 items-center justify-center border border-amber-500/40 bg-amber-500/10 transition-all group-hover:border-amber-400/70 group-hover:bg-amber-500/20">
              <img src="/favicon.svg" alt="DevHire logo" className="h-full w-full object-contain" />
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-zinc-100 sm:block">DevHire</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <span className="text-slate-500 text-sm">
                  <span className="text-slate-200 font-medium">{user.name || user.companyName}</span>
                  <span className="ml-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold border border-white/10 px-1.5 py-0.5">{user.role}</span>
                </span>
                {user.role === 'recruiter' && (
                  <Link
                    to="/recruiter-help"
                    className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm"
                    aria-label="View recruiter help guide"
                  >
                    <HelpCircle size={15} />
                    Help Guide
                  </Link>
                )}
                {user.role === 'candidate' && (
                  <Link
                    to="/candidate-help"
                    className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm"
                    aria-label="View candidate help guide"
                  >
                    <HelpCircle size={15} />
                    Help Guide
                  </Link>
                )}
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm"
                  aria-label="Go to dashboard"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm"
                  aria-label="Logout from account"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/jobs" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">
                  Browse Jobs
                </Link>
                <Link to="/login" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl border border-amber-500/40 bg-amber-500 px-5 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-amber-400"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-primary transition-colors"
            aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-white/5"
            >
              {user ? (
                <div className="space-y-4 py-6 px-4">
                  <p className="text-slate-500 text-sm">
                    <span className="text-slate-200 font-medium">{user.name || user.companyName}</span>
                    <span className="ml-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold border border-white/10 px-1.5 py-0.5">{user.role}</span>
                  </p>
                  {user.role === 'recruiter' && (
                    <Link to="/recruiter-help" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-500 hover:text-white py-2 transition-colors">
                      <HelpCircle size={16} /> Help Guide
                    </Link>
                  )}
                  {user.role === 'candidate' && (
                    <Link to="/candidate-help" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-500 hover:text-white py-2 transition-colors">
                      <HelpCircle size={16} /> Help Guide
                    </Link>
                  )}
                  <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-500 hover:text-white py-2 transition-colors">
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 text-slate-500 hover:text-white py-2 transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-4 py-6 px-4">
                  <Link to="/jobs" className="block text-slate-500 hover:text-white py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Browse Jobs</Link>
                  <Link to="/login" className="block text-slate-500 hover:text-white py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                  <Link to="/register" className="block w-full border border-primary text-primary py-3 font-semibold text-center hover:bg-primary hover:text-black transition-all uppercase tracking-wider text-sm rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                    Get started
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
