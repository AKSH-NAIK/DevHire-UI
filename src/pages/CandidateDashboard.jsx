'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, FileText, Zap } from 'lucide-react'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'
import JobCard from '../components/JobCard'

export default function CandidateDashboard() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()
  const [applications, setApplications] = useState([])
  const [applicationJobs, setApplicationJobs] = useState([])
  const [stats, setStats] = useState({
    totalApplications: 0,
    viewedJobs: 0,
    savedJobs: 0,
  })

  useEffect(() => {
    if (!user || user.role !== 'candidate') {
      navigate('/login')
      return
    }

    // Load candidate's applications
    const userApplications = jobsService.getApplications({ candidateId: user.id })
    setApplications(userApplications)

    // Get jobs for applied positions
    const jobs = userApplications.map(app => jobsService.getJobById(app.jobId)).filter(Boolean)
    setApplicationJobs(jobs)

    setStats({
      totalApplications: userApplications.length,
      viewedJobs: userApplications.length, // Simplified for demo
      savedJobs: 0, // Would need to implement favorites
    })
  }, [user, navigate])

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tighter uppercase">Dashboard</h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Welcome, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Applications', value: stats.totalApplications, icon: Briefcase },
            { label: 'Jobs Viewed', value: stats.viewedJobs, icon: Zap },
            { label: 'Saved Jobs', value: stats.savedJobs, icon: FileText },
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="bg-black border border-white/10 rounded-none p-8 transition-all hover:border-primary/30 group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[10px] items-center uppercase font-bold tracking-widest mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-white tracking-tighter">{stat.value}</p>
                  </div>
                  <Icon className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" size={32} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Applications */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Active Applications</h2>
          {applicationJobs.length === 0 ? (
            <div className="bg-black border border-white/5 rounded-none p-20 text-center">
              <Briefcase size={48} className="mx-auto text-slate-700 mb-6" />
              <p className="text-slate-500 mb-8 uppercase tracking-widest text-xs font-bold">No applications found</p>
              <button
                onClick={() => navigate('/jobs')}
                className="px-10 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
              >
                Browse Jobs
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {applicationJobs.map(job => (
                <JobCard key={job.id} job={job} userRole={user?.role} />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-white/5 border border-white/5 rounded-none p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4 tracking-tight uppercase">Expand Your Horizon</h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">Discover more opportunities tailored to your skills and preferences.</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-12 py-4 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
          >
            Explore All Opportunities
          </button>
        </div>
      </div>
    </div>
  )
}
