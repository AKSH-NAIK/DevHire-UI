'use client';

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AreaOfInterestField from '../components/AreaOfInterestField'
import { ButtonSpinner } from '../components/Loader'

export default function Register() {
  const navigate = useNavigate()

  const [role, setRole] = useState('candidate')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    companyName: '',
    website: '',
  })

  const [areaOfInterest, setAreaOfInterest] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.email) return 'Email is required'
    if (!formData.password) return 'Password is required'
    if (formData.password.length < 6) return 'Password must be at least 6 characters'
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match'
    if (!formData.name) return 'Name is required'
    if (role === 'recruiter' && !formData.companyName) return 'Company name is required'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setError('')
    setLoading(true)

    try {
      const validationError = validateForm()
      if (validationError) {
        setError(validationError)
        toast.error(validationError)
        setLoading(false)
        return
      }

      // Prepare user data
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      }

      if (role === 'candidate') {
        userData.areaOfInterest = areaOfInterest
      } else {
        userData.companyName = formData.companyName
        userData.website = formData.website
      }

      // 1️⃣ Register user in DB
      await authService.register(userData)

      // 2️⃣ Automatically login after registration
      const response = await authService.login(formData.email, formData.password)
      const user = response.user
      toast.success('Account created successfully! Welcome to DevHire 🎉')

      // 3️⃣ Redirect based on role
      if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard')
      } else {
        navigate('/jobs')
      }

    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed'

      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    "w-full px-5 py-4 bg-black border border-white/10 text-white placeholder-slate-700 focus:outline-none focus:border-primary focus:shadow-glow-sm transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 border border-primary mx-auto mb-6 flex items-center justify-center">
            <span className="text-primary font-bold text-2xl">D</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter uppercase">
            Create Account
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            Join DevHire today
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8 flex gap-3">
          {['candidate', 'recruiter'].map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              disabled={loading}
              className={`flex-1 py-4 border text-[10px] font-bold uppercase tracking-widest transition-all ${role === r
                ? 'bg-primary border-primary text-black shadow-glow-sm'
                : 'bg-black border-white/10 text-slate-500 hover:border-primary/50'
                }`}
            >
              {r === 'candidate' ? 'Job Seeker' : 'Recruiter'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-8 bg-black border border-white/10 shadow-glow-sm"
        >

          {error && (
            <div className="border border-red-900/50 bg-red-950/20 p-4 flex gap-3 text-red-500 text-[10px] font-bold uppercase tracking-widest">
              <AlertCircle size={16} />
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
              className={inputClass}
              required
              disabled={loading}
            />

            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={loading}
            />

            {role === 'candidate' && (
              <AreaOfInterestField
                value={areaOfInterest}
                onChange={setAreaOfInterest}
              />
            )}

            {role === 'recruiter' && (
              <>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                  disabled={loading}
                />
                <input
                  type="url"
                  name="website"
                  placeholder="Company website (optional)"
                  value={formData.website}
                  onChange={handleChange}
                  className={inputClass}
                  disabled={loading}
                />
              </>
            )}

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-primary"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-primary"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-40"
          >
            {loading ? (
              <>
                <ButtonSpinner /> Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}