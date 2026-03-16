'use client';

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, FileText, Zap, Search } from 'lucide-react'
import { authService } from '../services/authService'
import { getMyApplications } from '../services/applicationService'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'

export default function CandidateDashboard() {
  const navigate = useNavigate()
  const user = authService.getCurrentUser()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    shortlisted: 0,
    rejected: 0,
    pending: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'candidate') {
      navigate('/login')
      return
    }

    const fetchDashboardData = async () => {
      try {
        const userApplications = await getMyApplications()

        // Filter out deleted jobs
        const validApplications = userApplications.filter(app => app.job)

        setApplications(validApplications)

        // ✅ Correct Status Logic
        setStats({
          total: validApplications.length,
          shortlisted: validApplications.filter(a => a.status === 'shortlisted').length,
          rejected: validApplications.filter(a => a.status === 'rejected').length,
          pending: validApplications.filter(a => a.status === 'pending').length,
        })

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [navigate])

  if (!user) return null

  const statItems = [
    { label: 'Applications', value: stats.total, icon: Briefcase },
    { label: 'Pending', value: stats.pending, icon: Zap },
    { label: 'Shortlisted', value: stats.shortlisted, icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-[#1F1F1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tighter uppercase">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statItems.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div
                key={idx}
                className="bg-[#1F1F1F] border border-white/10 p-8 transition-all hover:border-primary/30 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold text-white tracking-tighter">
                      {stat.value}
                    </p>
                  </div>
                  <Icon
                    className="text-primary opacity-20 group-hover:opacity-100 transition-opacity"
                    size={32}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Applications Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
            My Applications
          </h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader size="lg" label="Loading applications..." />
            </div>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={<Briefcase size={48} />}
              title="No Applications Yet"
              message="You haven't applied to any jobs yet. Browse available roles and apply today."
              action={{ label: 'Browse Jobs', onClick: () => navigate('/jobs') }}
            />
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const { job } = app

                return (
                  <div
                    key={app._id}   // ✅ Fixed key
                    className="bg-[#1F1F1F] border border-white/10 p-5 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start sm:items-center gap-4">

                      {/* Company Initials */}
                      <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 group-hover:border-primary/40 transition-colors">
                        {job.company
                          .split(' ')
                          .map(w => w[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="text-white font-bold tracking-tight">
                          {job.title}
                        </p>

                        <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mt-0.5">
                          {job.company} · {job.location}
                        </p>

                        <p className="text-slate-700 text-[10px] uppercase tracking-widest mt-1">
                          Applied{' '}
                          {new Date(app.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                          {' · '}
                          {job.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {job.createdBy?.email && (
                        <a
                          href={`mailto:${job.createdBy.email}`}
                          className="text-[10px] border border-primary/50 px-3 py-1.5 uppercase font-bold tracking-widest text-primary hover:bg-primary hover:text-black transition"
                        >
                          Contact Recruiter
                        </a>
                      )}
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-white/5 border border-white/5 p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4 tracking-tight uppercase">
            Explore More Roles
          </h3>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto leading-relaxed">
            Discover opportunities tailored to your skills and preferences.
          </p>

          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center gap-2 px-12 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
          >
            <Search size={16} />
            Browse All Jobs
          </button>
        </div>

      </div>
    </div>
  )
}