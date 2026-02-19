'use client';

import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'
import JobForm from '../components/JobForm'

export default function EditJob() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const user = authService.getCurrentUser()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/login')
      return
    }

    const job = jobsService.getJobById(jobId)
    if (!job || job.companyId !== user.id) {
      navigate('/recruiter-dashboard')
      return
    }

    setJob({
      ...job,
      requirements: job.requirements.join(', '),
    })
  }, [jobId, user, navigate])

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      jobsService.updateJob(jobId, {
        ...formData,
        requirements: formData.requirements,
      })
      navigate('/recruiter-dashboard')
    } catch (error) {
      console.error('Error updating job:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Job</h1>
          <p className="text-slate-400">Update the job details below</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded p-8">
          <JobForm initialData={job} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}
