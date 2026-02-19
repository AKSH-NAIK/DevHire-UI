'use client';

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit2, BarChart3, Briefcase } from 'lucide-react'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'

export default function RecruiterDashboard() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    totalApplications: 0,
  })

  useEffect(() => {
    if (!user || user.role !== 'recruiter') {
      navigate('/login')
      return
    }

    // Load recruiter's jobs
    const allJobs = jobsService.getAllJobs({ companyId: user.id })
    setJobs(allJobs)

    // Calculate stats
    setStats({
      totalJobs: allJobs.length,
      activeJobs: allJobs.filter(j => j.status === 'active').length,
      pendingJobs: allJobs.filter(j => j.status === 'pending').length,
      totalApplications: allJobs.reduce((sum, j) => sum + (j.applicants || 0), 0),
    })
  }, [user, navigate])

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      jobsService.deleteJob(jobId)
      setJobs(jobs.filter(j => j.id !== jobId))
    }
  }

  const handleActivateJob = (jobId) => {
    jobsService.updateJob(jobId, { status: 'active', verified: true })
    setJobs(jobs.map(j =>
      j.id === jobId ? { ...j, status: 'active', verified: true } : j
    ))
  }

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
            className="flex items-center gap-2 px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-glow-sm"
          >
            <Plus size={18} />
            Post a Job
          </Link>
        </div>

        {/* Verification Banner */}
        {!user?.verified && (
          <div className="bg-white/5 border border-white/10 rounded-none p-5 mb-12 flex items-center justify-between">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Verification Required <span className="text-slate-600 mx-2 text-[10px]">—</span> Postings currently unverified
            </p>
            <button className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline">Request Audit</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase },
            { label: 'Active Jobs', value: stats.activeJobs, icon: BarChart3 },
            { label: 'Pending', value: stats.pendingJobs, icon: Plus },
            { label: 'Applications', value: stats.totalApplications, icon: Briefcase },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-black border border-white/10 rounded-none p-8 transition-all hover:border-primary/30 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-white tracking-tighter">{stat.value}</p>
                  </div>
                  <Icon className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" size={32} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Jobs List */}
        <div className="bg-black border border-white/10 rounded-none overflow-hidden pb-8">
          <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Management Console</h2>
          </div>

          {jobs.length === 0 ? (
            <div className="p-20 text-center">
              <Briefcase size={48} className="mx-auto text-slate-800 mb-6" />
              <p className="text-slate-500 mb-8 uppercase tracking-widest text-[10px] font-bold">No job history available</p>
              <Link
                to="/post-job"
                className="px-10 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
              >
                Launch First Posting
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-black/50">
                    <th className="px-8 py-5 text-left text-slate-500 text-[10px] font-bold uppercase tracking-widest">Job Identity</th>
                    <th className="px-8 py-5 text-left text-slate-500 text-[10px] font-bold uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-left text-slate-500 text-[10px] font-bold uppercase tracking-widest">Volume</th>
                    <th className="px-8 py-5 text-left text-slate-500 text-[10px] font-bold uppercase tracking-widest">Timestamp</th>
                    <th className="px-8 py-5 text-right text-slate-500 text-[10px] font-bold uppercase tracking-widest">Control</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-white font-bold tracking-tight text-lg group-hover:text-primary transition-colors">{job.title}</p>
                          <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">{job.location}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-widest ${job.status === 'active'
                              ? 'border-primary/30 text-primary bg-primary/5 shadow-glow-sm'
                              : 'border-slate-800 text-slate-600'
                              }`}
                          >
                            {job.status === 'active' ? 'Active' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-200 font-mono text-lg">{job.applicants || 0}</td>
                      <td className="px-8 py-6 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        {new Date(job.postedAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-slate-600">
                          {job.status === 'pending' && (
                            <button
                              onClick={() => handleActivateJob(job.id)}
                              className="p-2 border border-transparent hover:border-primary/30 hover:text-primary transition-all"
                              title="Activate"
                            >
                              <BarChart3 size={18} />
                            </button>
                          )}
                          <Link
                            to={`/edit-job/${job.id}`}
                            className="p-2 border border-transparent hover:border-primary/30 hover:text-primary transition-all"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-2 border border-transparent hover:border-red-900/40 hover:text-red-500 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
