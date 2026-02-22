'use client';

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus, Trash2, Edit2, BarChart3,
  Briefcase, ChevronDown, ChevronUp,
  User, Mail, Phone, FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'
import ConfirmModal from '../components/ConfirmModal'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { ButtonSpinner } from '../components/Loader'

export default function RecruiterDashboard() {

  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0
  })

  const [confirmModal, setConfirmModal] = useState({ open: false, jobId: null })
  const [expandedJobId, setExpandedJobId] = useState(null)
  const [applicantsMap, setApplicantsMap] = useState({})
  const [updatingApp, setUpdatingApp] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/login')
      return
    }
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await jobsService.getAllJobs()

      // Handle backend response safely
      const allJobs = Array.isArray(response)
        ? response
        : response?.jobs || []

      // Filter only this recruiter’s jobs
      const myJobs = allJobs.filter(job =>
        job.createdBy === user.id ||
        job.createdBy?._id === user.id
      )

      setJobs(myJobs)

      setStats({
        totalJobs: myJobs.length,
        activeJobs: myJobs.length,
        totalApplications: myJobs.reduce(
          (sum, j) => sum + (j.applicants || 0),
          0
        )
      })

    } catch (error) {
      console.error("Failed to load jobs:", error)
      toast.error("Failed to load jobs")
    }
  }

  const handleDeleteClick = (jobId) => {
    setConfirmModal({ open: true, jobId })
  }

  const handleDeleteConfirm = async () => {
    try {
      await jobsService.deleteJob(confirmModal.jobId)

      setJobs(prev => prev.filter(j => j._id !== confirmModal.jobId))

      toast.success('Job deleted successfully')

    } catch (error) {
      toast.error("Failed to delete job")
    } finally {
      setConfirmModal({ open: false, jobId: null })
    }
  }

  const handleToggleApplicants = async (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null)
      return
    }

    setExpandedJobId(jobId)

    if (!applicantsMap[jobId]) {
      try {
        const apps = await jobsService.getApplications({ jobId })
        setApplicantsMap(prev => ({
          ...prev,
          [jobId]: Array.isArray(apps) ? apps : []
        }))
      } catch (error) {
        console.error("Failed to fetch applications:", error)
      }
    }
  }

  const handleStatusUpdate = async (applicationId, status, jobId) => {
    setUpdatingApp(applicationId)

    try {
      const updated = await jobsService.updateApplicationStatus(applicationId, status)

      setApplicantsMap(prev => ({
        ...prev,
        [jobId]: prev[jobId].map(a =>
          a._id === applicationId ? { ...a, status: updated.status } : a
        ),
      }))

      toast.success("Status updated")

    } catch (err) {
      toast.error('Could not update status')
    } finally {
      setUpdatingApp(null)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Recruiter Dashboard</h1>
            <p className="text-slate-500 text-sm">{user?.companyName}</p>
          </div>

          <Link
            to="/post-job"
            className="flex items-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-black transition-all"
          >
            <Plus size={16} /> Post Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <StatCard label="Total Jobs" value={stats.totalJobs} />
          <StatCard label="Active Jobs" value={stats.activeJobs} />
          <StatCard label="Applications" value={stats.totalApplications} />
        </div>

        {/* Jobs Table */}
        {jobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase size={48} />}
            title="No Jobs Posted"
            message="Start by posting your first job."
            action={{ label: 'Post Job', onClick: () => navigate('/post-job') }}
          />
        ) : (
          <div className="border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left">Job</th>
                  <th className="p-4 text-left">Applicants</th>
                  <th className="p-4 text-left">Posted</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job._id} className="border-b border-white/5">
                    <td className="p-4">
                      <p className="text-white font-bold">{job.title}</p>
                      <p className="text-slate-500 text-sm">{job.location}</p>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleApplicants(job._id)}
                        className="flex items-center gap-2"
                      >
                        {job.applicants || 0}
                        {expandedJobId === job._id
                          ? <ChevronUp size={14} />
                          : <ChevronDown size={14} />}
                      </button>
                    </td>

                    <td className="p-4 text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right flex justify-end gap-3">
                      <Link to={`/edit-job/${job._id}`}>
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDeleteClick(job._id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, jobId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Job"
        message="Are you sure?"
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="border border-white/10 p-6">
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-3xl text-white font-bold">{value}</p>
    </div>
  )
}