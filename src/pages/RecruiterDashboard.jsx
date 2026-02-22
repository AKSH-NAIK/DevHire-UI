'use client';

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit2, BarChart3, Briefcase, ChevronDown, ChevronUp, User, Mail, Phone, FileText } from 'lucide-react'
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
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, pendingJobs: 0, totalApplications: 0 })
  // Confirm delete modal state
  const [confirmModal, setConfirmModal] = useState({ open: false, jobId: null })
  // Expanded applicant rows
  const [expandedJobId, setExpandedJobId] = useState(null)
  const [applicantsMap, setApplicantsMap] = useState({}) // jobId -> applications[]
  // Per-application status update loading
  const [updatingApp, setUpdatingApp] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'recruiter') { navigate('/login'); return }
    loadJobs()
  }, [navigate])

  const loadJobs = async () => {
    try {
      const allJobs = await jobsService.getAllJobs({ companyId: user.id })
      setJobs(Array.isArray(allJobs) ? allJobs : [])
      setStats({
        totalJobs: allJobs.length,
        activeJobs: allJobs.filter(j => j.status === 'active').length,
        pendingJobs: allJobs.filter(j => j.status === 'pending').length,
        totalApplications: allJobs.reduce((sum, j) => sum + (j.applicants || 0), 0),
      })
    } catch (error) {
      console.error("Failed to load jobs:", error)
    }
  }

  const handleDeleteClick = (jobId) => {
    setConfirmModal({ open: true, jobId })
  }

  const handleDeleteConfirm = async () => {
    try {
      await jobsService.deleteJob(confirmModal.jobId)
      setJobs(prev => prev.filter(j => j.id !== confirmModal.jobId))
      setStats(prev => ({ ...prev, totalJobs: prev.totalJobs - 1 }))
      toast.success('Job listing deleted.')
    } catch (error) {
      toast.error("Failed to delete job.")
    }
  }

  const handleActivateJob = async (jobId) => {
    try {
      await jobsService.updateJob(jobId, { status: 'active', verified: true })
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'active', verified: true } : j))
      toast.success('Job activated and now visible to candidates.')
    } catch (error) {
      toast.error("Failed to activate job.")
    }
  }

  // Toggle applicants panel for a job row
  const handleToggleApplicants = async (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null)
      return
    }
    setExpandedJobId(jobId)
    if (!applicantsMap[jobId]) {
      try {
        const apps = await jobsService.getApplications({ jobId })
        setApplicantsMap(prev => ({ ...prev, [jobId]: apps }))
      } catch (error) {
        console.error("Failed to fetch applications:", error)
      }
    }
  }

  // Accept / Reject / Review applicant
  const handleStatusUpdate = async (applicationId, status, jobId) => {
    setUpdatingApp(applicationId)
    try {
      const updated = await jobsService.updateApplicationStatus(applicationId, status)
      // Update local applicant map without page reload
      setApplicantsMap(prev => ({
        ...prev,
        [jobId]: prev[jobId].map(a => a.id === applicationId ? { ...a, status: updated.status } : a),
      }))
      const labels = { accepted: 'Accepted ✓', rejected: 'Rejected', reviewed: 'Marked as reviewed' }
      toast.success(labels[status] || 'Status updated')
    } catch (err) {
      toast.error(err.message || 'Could not update status')
    } finally {
      setUpdatingApp(null)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tighter uppercase">Recruiter</h1>
            <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">{user?.companyName}</p>
          </div>
          <Link
            to="/post-job"
            className="flex items-center gap-2 px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold uppercase tracking-widest shadow-glow-sm"
          >
            <Plus size={18} /> Post a Job
          </Link>
        </div>

        {/* Unverified banner */}
        {!user?.verified && (
          <div className="bg-white/5 border border-white/10 p-5 mb-12 flex items-center justify-between">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Verification Required <span className="text-slate-600 mx-2">—</span> Postings currently unverified
            </p>
            <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline">Request Audit</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase },
            { label: 'Active', value: stats.activeJobs, icon: BarChart3 },
            { label: 'Pending', value: stats.pendingJobs, icon: Plus },
            { label: 'Applications', value: stats.totalApplications, icon: Briefcase },
          ].map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={idx} className="bg-black border border-white/10 p-6 hover:border-primary/30 transition-all group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">{s.label}</p>
                    <p className="text-3xl font-bold text-white tracking-tighter">{s.value}</p>
                  </div>
                  <Icon className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" size={28} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Jobs Table */}
        <div className="bg-black border border-white/10 overflow-hidden">
          <div className="px-8 py-5 border-b border-white/10 bg-white/5 flex justify-between items-center">
            <h2 className="text-base font-bold text-white uppercase tracking-tight">Management Console</h2>
          </div>

          {jobs.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={48} />}
              title="No Jobs Posted"
              message="You haven't posted any jobs yet. Launch your first posting to find great candidates."
              action={{ label: 'Post First Job', onClick: () => navigate('/post-job') }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-black/50">
                    <th className="px-8 py-4 text-left text-slate-500 text-[10px] font-bold uppercase tracking-widest">Job</th>
                    <th className="px-8 py-4 text-left text-slate-500 text-[10px] font-bold uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-left text-slate-500 text-[10px] font-bold uppercase tracking-widest">Applicants</th>
                    <th className="px-8 py-4 text-left text-slate-500 text-[10px] font-bold uppercase tracking-widest">Posted</th>
                    <th className="px-8 py-4 text-right text-slate-500 text-[10px] font-bold uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <>
                      <tr key={job.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-5">
                          <p className="text-white font-bold tracking-tight group-hover:text-primary transition-colors">{job.title}</p>
                          <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">{job.location}</p>
                        </td>
                        <td className="px-8 py-5">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="px-8 py-5">
                          <button
                            onClick={() => handleToggleApplicants(job.id)}
                            className="flex items-center gap-1.5 text-slate-200 font-mono text-base hover:text-primary transition-colors"
                          >
                            {job.applicants || 0}
                            {expandedJobId === job.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                        <td className="px-8 py-5 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                          {new Date(job.postedAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {job.status === 'pending' && (
                              <button
                                onClick={() => handleActivateJob(job.id)}
                                className="p-2 border border-transparent hover:border-primary/30 hover:text-primary text-slate-600 transition-all"
                                title="Activate"
                              >
                                <BarChart3 size={16} />
                              </button>
                            )}
                            <Link
                              to={`/edit-job/${job.id}`}
                              className="p-2 border border-transparent hover:border-primary/30 hover:text-primary text-slate-600 transition-all"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(job.id)}
                              className="p-2 border border-transparent hover:border-red-900/40 hover:text-red-500 text-slate-600 transition-all"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Applicant panel */}
                      {expandedJobId === job.id && (
                        <tr key={`${job.id}-applicants`}>
                          <td colSpan={5} className="px-8 py-0">
                            <div className="border border-white/10 bg-white/[0.02] mb-2">
                              {/* Panel header */}
                              <div className="px-6 py-3 border-b border-white/10 flex items-center gap-2">
                                <User size={14} className="text-primary" />
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Applicants for {job.title}</span>
                              </div>

                              {(applicantsMap[job.id] || []).length === 0 ? (
                                <div className="px-6 py-8 text-center">
                                  <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">No applicants yet</p>
                                </div>
                              ) : (
                                <div className="divide-y divide-white/5">
                                  {(applicantsMap[job.id] || []).map(app => (
                                    <div key={app.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      {/* Applicant info */}
                                      <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                          <User size={13} className="text-slate-600" />
                                          <span className="text-white text-sm font-bold">{app.applicantName || 'Unknown Candidate'}</span>
                                          <StatusBadge status={app.status} />
                                        </div>
                                        {app.applicantEmail && (
                                          <div className="flex items-center gap-2">
                                            <Mail size={12} className="text-slate-700" />
                                            <span className="text-slate-500 text-xs">{app.applicantEmail}</span>
                                          </div>
                                        )}
                                        {app.phone && (
                                          <div className="flex items-center gap-2">
                                            <Phone size={12} className="text-slate-700" />
                                            <span className="text-slate-500 text-xs">{app.phone}</span>
                                          </div>
                                        )}
                                        {app.resumeName && (
                                          <div className="flex items-center gap-2">
                                            <FileText size={12} className="text-slate-700" />
                                            <span className="text-slate-500 text-xs">{app.resumeName}</span>
                                          </div>
                                        )}
                                        <p className="text-slate-700 text-[10px] uppercase tracking-widest mt-1">
                                          Applied {new Date(app.appliedAt).toLocaleDateString()}
                                        </p>
                                      </div>

                                      {/* Action buttons */}
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                          disabled={updatingApp === app.id || app.status === 'reviewed'}
                                          onClick={() => handleStatusUpdate(app.id, 'reviewed', job.id)}
                                          className="px-3 py-1.5 border border-blue-800/50 text-blue-400 hover:bg-blue-900/20 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                                        >
                                          {updatingApp === app.id ? <ButtonSpinner /> : null}
                                          Review
                                        </button>
                                        <button
                                          disabled={updatingApp === app.id || app.status === 'accepted'}
                                          onClick={() => handleStatusUpdate(app.id, 'accepted', job.id)}
                                          className="px-3 py-1.5 border border-green-800/50 text-green-400 hover:bg-green-900/20 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                                        >
                                          {updatingApp === app.id ? <ButtonSpinner /> : null}
                                          Accept
                                        </button>
                                        <button
                                          disabled={updatingApp === app.id || app.status === 'rejected'}
                                          onClick={() => handleStatusUpdate(app.id, 'rejected', job.id)}
                                          className="px-3 py-1.5 border border-red-900/50 text-red-400 hover:bg-red-950/20 transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                                        >
                                          {updatingApp === app.id ? <ButtonSpinner /> : null}
                                          Reject
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, jobId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Listing"
        message="Are you sure you want to delete this job? This action cannot be undone and all applications will be lost."
        confirmText="Delete Job"
        confirmVariant="danger"
      />
    </div>
  )
}
