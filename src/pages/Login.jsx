'use client';

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { ButtonSpinner } from '../components/Loader'
import { motion } from 'framer-motion'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return ""
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(formData.email, formData.password)
      const { user, token } = response

      // Update global context
      login(user, token)

      toast.success(`Welcome back, ${user.name || user.companyName}!`)

      if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard')
      } else {
        navigate('/jobs')
      }
    } catch (err) {
      const errorMessage = err.message
      setError(errorMessage)

      if (errorMessage.toLowerCase().includes('verify your email')) {
        toast.error('Email not verified. Please check your inbox and verify first.', {
          duration: 5000,
        })
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 border border-primary/30 mx-auto mb-6 flex items-center justify-center rounded-2xl bg-primary/5 transition-all hover:shadow-glow-primary">
            <span className="text-primary font-bold text-2xl">D</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter uppercase text-glow">Login</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Welcome back to DevHire</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-8 glass-dark rounded-2xl border border-white/10 shadow-glow-primary/10">
          {error && (
            <div className="border border-red-900/50 bg-red-950/20 p-4 flex gap-3 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-primary focus:shadow-glow-sm transition-all text-[10px] font-bold lowercase tracking-widest rounded-xl"
              required
              disabled={loading}
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-primary focus:shadow-glow-sm transition-all text-[10px] font-bold uppercase tracking-widest rounded-xl"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed rounded-xl"
          >
            {loading ? <><ButtonSpinner /> Logging in...</> : 'Login'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline transition-colors">
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
