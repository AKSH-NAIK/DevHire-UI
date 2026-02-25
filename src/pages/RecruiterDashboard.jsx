'use client';

import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus, Trash2, Edit2,
  Briefcase, ChevronDown, ChevronUp,
  Mail, Phone, FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'
import { getApplicationsForJob, updateApplicationStatus } from '../services/applicationService'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'

export default function RecruiterDashboard() {

  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const [jobs, setJobs] = useState([])
  const [expandedJobId, setExpandedJobId] = useState(null)
  const [applicantsMap, setApplicantsMap] = useState({})
  const [confirmModal, setConfirmModal] = useState({ open: false, jobId: null })

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

      const allJobs = Array.isArray(response)
        ? response
        : response?.jobs || []

      const myJobs = allJobs.filter(job =>
        job.createdBy === user.id ||
        job.createdBy?._id === user.id
      )

      setJobs(myJobs)

    } catch (error) {
      console.error("Failed to load jobs:", error)
      toast.error("Failed to load jobs")
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
        const apps = await getApplicationsForJob(jobId)

        setApplicantsMap(prev => ({
          ...prev,
          [jobId]: Array.isArray(apps) ? apps : []
        }))

      } catch (error) {
        console.error("Failed to fetch applications:", error)
        toast.error("Failed to fetch applications")
      }
    }
  }

  const handleUpdateStatus = async (jobId, applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus)
      toast.success(`Application ${newStatus}`)

      // Update local state
      setApplicantsMap(prev => ({
        ...prev,
        [jobId]: prev[jobId].map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      }))
    } catch (error) {
      console.error("Failed to update status:", error)
      toast.error("Failed to update status")
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await jobsService.deleteJob(confirmModal.jobId)
      setJobs(prev => prev.filter(j => j._id !== confirmModal.jobId))
      toast.success('Job deleted successfully')
    } catch {
      toast.error("Failed to delete job")
    } finally {
      setConfirmModal({ open: false, jobId: null })
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

        {/* Jobs */}
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
                  <React.Fragment key={job._id}>

                    {/* Main Job Row */}
                    <tr className="border-b border-white/5">
                      <td className="p-4">
                        <p className="text-white font-bold">{job.title}</p>
                        <p className="text-slate-500 text-sm">{job.location}</p>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleApplicants(job._id)}
                          className="flex items-center gap-2"
                        >
                          {applicantsMap[job._id]?.length || 0}
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
                        <button onClick={() => setConfirmModal({ open: true, jobId: job._id })}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>

                    {/* Applications Row */}
                    {expandedJobId === job._id && (
                      <tr className="bg-black/40">
                        <td colSpan="4" className="p-6">

                          {!applicantsMap[job._id] || applicantsMap[job._id].length === 0 ? (
                            <p className="text-slate-500">No applications yet.</p>
                          ) : (
                            <div className="space-y-4">

                              {applicantsMap[job._id].map(app => (
                                <div key={app._id} className="border border-white/10 p-4 rounded">

                                  <p className="text-white font-semibold">
                                    {app.user?.name}
                                  </p>

                                  <p className="text-slate-400 text-sm flex items-center gap-2">
                                    <Mail size={14} /> {app.user?.email}
                                  </p>

                                  <p className="text-slate-400 text-sm flex items-center gap-2">
                                    <Phone size={14} /> {app.phone}
                                  </p>

                                  <div className="flex items-center justify-between mt-4">
                                    <div className="flex gap-2">
                                      {['shortlisted', 'rejected', 'reviewed'].map(status => (
                                        <button
                                          key={status}
                                          onClick={() => handleUpdateStatus(job._id, app._id, status)}
                                          className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest border transition-all ${app.status === status
                                            ? 'bg-primary border-primary text-black'
                                            : 'border-white/10 text-slate-500 hover:border-primary/50'
                                            }`}
                                        >
                                          {status}
                                        </button>
                                      ))}
                                    </div>

                                    {app.resume && (
                                      <a
                                        href={`http://localhost:5000/${app.resume}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-primary underline text-sm flex items-center gap-2"
                                      >
                                        <FileText size={14} /> View Resume
                                      </a>
                                    )}
                                  </div>

                                </div>
                              ))}

                            </div>
                          )}

                        </td>
                      </tr>
                    )}

                  </React.Fragment>
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