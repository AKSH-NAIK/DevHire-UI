'use client';

import { useState, useEffect } from 'react'
import { Search, Briefcase, MapPin } from 'lucide-react'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'
import JobCard from '../components/JobCard'

export default function Jobs() {
  const user = authService.getCurrentUser()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load all jobs
    const allJobs = jobsService.getAllJobs({ status: 'active' })
    setJobs(allJobs)

    // Load applied jobs if candidate is logged in
    if (user && user.role === 'candidate') {
      const applications = jobsService.getApplications({ candidateId: user.id })
      setAppliedJobs(new Set(applications.map(a => a.jobId)))
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    let filtered = jobs

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.location.toLowerCase().includes(search) ||
        job.requirements.some(r => r.toLowerCase().includes(search))
      )
    }

    // Filter by job type
    if (selectedType !== 'all') {
      filtered = filtered.filter(job => job.type === selectedType)
    }

    setFilteredJobs(filtered)
  }, [jobs, searchTerm, selectedType])

  const handleApply = (jobId) => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    try {
      jobsService.applyToJob(jobId, user.id)
      setAppliedJobs(new Set([...appliedJobs, jobId]))
    } catch (error) {
      alert(error.message)
    }
  }

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tighter uppercase">Browse Roles</h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">{filteredJobs.length} matching positions found</p>
        </div>

        {/* Search and Filters */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {/* Search */}
          <div className="lg:col-span-2 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by role, company, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-black border border-white/10 rounded-none text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:shadow-glow-sm transition-all uppercase text-[10px] font-bold tracking-widest"
            />
          </div>

          {/* Type Filter */}
          <div className="relative group">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none px-6 py-4 bg-black border border-white/10 rounded-none text-slate-400 focus:outline-none focus:border-primary focus:shadow-glow-sm transition-all uppercase text-[10px] font-bold tracking-widest cursor-pointer"
            >
              <option value="all">Diversity (All Roles)</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover:text-primary transition-colors">
              ▼
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-slate-600 uppercase tracking-widest text-[10px] font-bold">Synchronizing Data...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-24 border border-white/5 bg-white/5">
            <Briefcase size={48} className="mx-auto text-slate-800 mb-6" />
            <p className="text-slate-600 uppercase tracking-widest text-[10px] font-bold">No match found in current database</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {filteredJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                userRole={user?.role}
                onApply={handleApply}
                isApplied={appliedJobs.has(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
