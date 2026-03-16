import { Link, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'

export default function Footer() {
  const { pathname } = useLocation()
  const user = authService.getCurrentUser()

  const getCandidateLink = (path) => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) return '/login'
    if (currentUser.role !== 'candidate') return '/login'
    return path
  }

  const getRecruiterLink = (path) => {
    const currentUser = authService.getCurrentUser()
    if (!currentUser) return '/login'
    if (currentUser.role !== 'recruiter') return '/login'
    return path
  }

  return (
    <footer className="bg-[#1F1F1F] border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group" aria-label="DevHire Home">
              <div className="w-8 h-8 border border-primary flex items-center justify-center transition-all group-hover:shadow-glow">
                <span className="text-primary font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-white text-xl tracking-tighter">DevHire</span>
            </Link>
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
              The world's leading platform for technical hiring. Connecting elite developers with the most innovative companies.
            </p>
          </div>

          {/* For Candidates */}
          <div>
            <h2 className="text-white text-[10px] font-bold mb-6 uppercase tracking-[0.2em]">For Candidates</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/jobs" className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to={getCandidateLink('/candidate-dashboard')}
                  className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest"
                >
                  My Applications
                </Link>
              </li>
              <li>
                <Link
                  to={getCandidateLink('/candidate-help')}
                  className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest"
                >
                  Help Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h2 className="text-white text-[10px] font-bold mb-6 uppercase tracking-[0.2em]">For Recruiters</h2>
            <ul className="space-y-3">
              <li>
                <Link
                  to={getRecruiterLink('/post-job')}
                  className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest"
                >
                  Post a Job
                </Link>
              </li>
              <li>
                <Link
                  to={getRecruiterLink('/recruiter-help')}
                  className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest"
                >
                  Help Guide
                </Link>
              </li>
              <li>
                <Link
                  to={getRecruiterLink('/recruiter-dashboard')}
                  className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest"
                >
                  Recruiter Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-white text-[10px] font-bold mb-6 uppercase tracking-[0.2em]">Company</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-500 hover:text-primary transition-colors text-[10px] uppercase font-bold tracking-widest">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-500 hover:text-secondary transition-colors text-[10px] uppercase font-bold tracking-widest">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center bg-[#1F1F1F]">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} DevHire. All rights reserved.
          </p>
          <div className="flex gap-8 mt-6 md:mt-0">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="text-slate-600 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest"
                aria-label={`Follow us on ${social}`}
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
