import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { authService } from '../services/authService'

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 border border-primary rounded-none flex items-center justify-center transition-all group-hover:shadow-glow">
              <span className="text-primary font-bold">D</span>
            </div>
            <span className="font-bold text-white text-xl tracking-tight hidden sm:block">DevHire</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <span className="text-slate-500 text-sm">
                  Welcome, <span className="text-slate-200 font-medium">{user.name || user.companyName}</span>
                </span>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors ${pathname === '/profile' ? 'text-primary' : 'text-slate-500 hover:text-white'
                    }`}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-0 py-2 text-slate-500 hover:text-white transition-colors text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/jobs" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">
                  Browse Jobs
                </Link>
                <Link
                  to="/login"
                  className="text-slate-500 hover:text-white transition-colors text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm font-semibold uppercase tracking-wider"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
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
              <div className="space-y-4 pt-4">
                <p className="px-4 text-slate-500 text-sm">
                  Welcome, <span className="text-slate-200 font-medium">{user.name || user.companyName}</span>
                </p>
                <Link
                  to="/profile"
                  className={`block px-4 py-2 text-sm transition-colors ${pathname === '/profile' ? 'text-primary' : 'text-slate-500 hover:text-white'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-slate-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4 pt-4 px-4">
                <Link
                  to="/jobs"
                  className="block text-slate-500 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/login"
                  className="block text-slate-500 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="block w-full border border-primary text-primary py-3 font-semibold text-center hover:bg-primary hover:text-white transition-all uppercase tracking-wider text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
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
