'use client';

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'
import JobForm from '../components/JobForm'
import toast from 'react-hot-toast'

export default function PostJob() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const [loading, setLoading] = useState(false)

  if (!user || user.role !== 'recruiter') {
    navigate('/login')
    return null
  }

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      await jobsService.createJob({
        ...formData,
        companyId: user.id || user._id,
        company: user.companyName,
      })
      toast.success('Job posted successfully! It will be reviewed before going live.')
      navigate('/recruiter-dashboard')
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to post job.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter uppercase">Post a Job</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Fill in the details to create a new listing</p>
        </div>
        <div className="bg-black border border-white/10 p-8">
          <JobForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}
