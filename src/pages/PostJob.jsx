'use client';

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'
import JobForm from '../components/JobForm'

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
      jobsService.createJob({
        ...formData,
        companyId: user.id,
        company: user.companyName,
      })
      navigate('/recruiter-dashboard')
    } catch (error) {
      console.error('Error posting job:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Post a New Job</h1>
          <p className="text-slate-400">Fill in the details below to create a new job listing</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded p-8">
          <JobForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}
