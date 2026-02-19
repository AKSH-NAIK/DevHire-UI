import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export default function Navbar() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    toast.success('Logged out successfully')
    navigate('/')
    setMobileMenuOpen(false)
  }

  const dashboardPath = user?.role === 'recruiter' ? '/recruiter-dashboard' : '/candidate-dashboard'

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 border border-primary flex items-center justify-center transition-all group-hover:shadow-glow">
              <span className="text-primary font-bold">D</span>
            </div>
            <span className="font-bold text-white text-xl tracking-tight hidden sm:block">DevHire</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <span className="text-slate-500 text-sm">
                  <span className="text-slate-200 font-medium">{user.name || user.companyName}</span>
                  <span className="ml-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold border border-white/10 px-1.5 py-0.5">{user.role}</span>
                </span>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm"
                >
                  <LayoutDashboard size={15} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm"
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
                  className="px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-black transition-all text-sm font-semibold uppercase tracking-wider"
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
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 border-t border-white/5 animate-in fade-in slide-in-from-top-4">
            {user ? (
              <div className="space-y-4 pt-4 px-4">
                <p className="text-slate-500 text-sm">
                  <span className="text-slate-200 font-medium">{user.name || user.companyName}</span>
                  <span className="ml-2 text-[10px] text-slate-600 uppercase tracking-widest font-bold">[{user.role}]</span>
                </p>
                <Link to={dashboardPath} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-slate-500 hover:text-white py-2 transition-colors">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 text-slate-500 hover:text-white py-2 transition-colors">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-4 px-4">
                <Link to="/jobs" className="block text-slate-500 hover:text-white py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Browse Jobs</Link>
                <Link to="/login" className="block text-slate-500 hover:text-white py-2 transition-colors" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="block w-full border border-primary text-primary py-3 font-semibold text-center hover:bg-primary hover:text-black transition-all uppercase tracking-wider text-sm" onClick={() => setMobileMenuOpen(false)}>
                  Get started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
