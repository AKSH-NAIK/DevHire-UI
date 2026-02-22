'use client';

import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'
import JobForm from '../components/JobForm'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

export default function EditJob() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const user = authService.getCurrentUser()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'recruiter') { navigate('/login'); return }
    const fetchJob = async () => {
      try {
        const found = await jobsService.getJobById(jobId)
        if (!found || found.companyId !== user.id) { navigate('/recruiter-dashboard'); return }
        setJob({ ...found, requirements: found.requirements.join(', ') })
      } catch (error) {
        console.error("Failed to fetch job for edit:", error)
        navigate('/recruiter-dashboard')
      }
    }
    fetchJob()
  }, [jobId, navigate])

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      await jobsService.updateJob(jobId, formData)
      toast.success('Job updated successfully!')
      navigate('/recruiter-dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to update job.')
    } finally {
      setLoading(false)
    }
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader size="lg" label="Loading job details..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter uppercase">Edit Job</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Update the details below</p>
        </div>
        <div className="bg-black border border-white/10 p-8">
          <JobForm initialData={job} onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}
