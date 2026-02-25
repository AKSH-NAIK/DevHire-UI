'use client';

import { useState, useEffect, useMemo } from 'react'
import { Search, Briefcase, MapPin } from 'lucide-react'
import { authService } from '../services/authService'
import { jobsService } from '../services/jobsService'
import { getMyApplications } from '../services/applicationService'
import JobCard from '../components/JobCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'

export default function Jobs() {
  const user = authService.getCurrentUser()

  const [jobs, setJobs] = useState([])
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        setLoading(true)

        // ✅ Get all jobs (backend already handles filtering)
        const response = await jobsService.getAllJobs()

        // Handle both formats: { jobs: [] } OR []
        const allJobs = Array.isArray(response)
          ? response
          : response?.jobs || []

        setJobs(allJobs)

        // ✅ If candidate, fetch applied jobs
        if (user?.role === 'candidate') {
          const applications = await getMyApplications()

          if (Array.isArray(applications)) {
            const appliedSet = new Set(
              applications.map(a =>
                a.job?._id || a.job || a.jobId
              )
            )
            setAppliedJobs(appliedSet)
          }
        }

      } catch (error) {
        console.error("Failed to fetch jobs or applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobsData()
  }, [])

  // Unique locations
  const locations = useMemo(() => {
    const locs = [...new Set(jobs.map(j => j.location).filter(Boolean))]
    return locs.sort()
  }, [jobs])

  // Frontend filtering
  const { appliedFilteredJobs, otherFilteredJobs } = useMemo(() => {
    let baseResult = jobs

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      baseResult = baseResult.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        (j.requirements || []).some(r =>
          r.toLowerCase().includes(q)
        )
      )
    }

    if (selectedType !== 'all') {
      baseResult = baseResult.filter(j => j.type === selectedType)
    }

    if (selectedLocation !== 'all') {
      baseResult = baseResult.filter(j => j.location === selectedLocation)
    }

    const applied = baseResult.filter(j => appliedJobs.has(j._id))
    const other = baseResult.filter(j => !appliedJobs.has(j._id))

    return { appliedFilteredJobs: applied, otherFilteredJobs: other }
  }, [jobs, searchTerm, selectedType, selectedLocation, appliedJobs])

  const handleApplySuccess = (jobId) => {
    setAppliedJobs(prev => new Set([...prev, jobId]))
  }

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship']

  const filterInputClass =
    "w-full appearance-none px-4 py-3.5 bg-black border border-white/10 text-slate-400 focus:outline-none focus:border-primary focus:shadow-glow-sm transition-all uppercase text-[10px] font-bold tracking-widest cursor-pointer"

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tighter uppercase">
            Browse Roles
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
            {loading
              ? 'Loading...'
              : `${appliedFilteredJobs.length + otherFilteredJobs.length} matching position${(appliedFilteredJobs.length + otherFilteredJobs.length) !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="grid lg:grid-cols-4 gap-4 mb-12">

          {/* Search */}
          <div className="lg:col-span-2 relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors pointer-events-none"
              size={18}
            />
            <input
              type="text"
              placeholder="Search role, company, skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-black border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-primary focus:shadow-glow-sm transition-all uppercase text-[10px] font-bold tracking-widest"
            />
          </div>

          {/* Job Type Filter */}
          <div className="relative group">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={filterInputClass}
            >
              <option value="all">All Types</option>
              {jobTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-[10px]">▼</div>
          </div>

          {/* Location Filter */}
          <div className="relative group">
            <MapPin
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
            />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className={`${filterInputClass} pl-10`}
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-[10px]">▼</div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader size="lg" label="Loading opportunities..." />
          </div>
        ) : (appliedFilteredJobs.length === 0 && otherFilteredJobs.length === 0) ? (
          <EmptyState
            icon={<Briefcase size={48} />}
            title="No Jobs Found"
            message={
              searchTerm || selectedType !== 'all' || selectedLocation !== 'all'
                ? 'No jobs match your current filters. Try adjusting your search.'
                : 'No active job listings available right now. Check back soon.'
            }
            action={
              (searchTerm || selectedType !== 'all' || selectedLocation !== 'all')
                ? {
                  label: 'Clear Filters',
                  onClick: () => {
                    setSearchTerm('')
                    setSelectedType('all')
                    setSelectedLocation('all')
                  }
                }
                : undefined
            }
          />
        ) : (
          <div className="space-y-16">
            {/* Applied Jobs Section */}
            {appliedFilteredJobs.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Applied Jobs</h2>
                  <div className="h-px flex-1 bg-white/10"></div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 border border-white/10">
                    {appliedFilteredJobs.length} ROLE{appliedFilteredJobs.length !== 1 ? 'S' : ''}
                  </span>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                  {appliedFilteredJobs.map(job => (
                    <JobCard
                      key={job._id}
                      job={job}
                      userRole={user?.role}
                      onApply={handleApplySuccess}
                      isApplied={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Other Jobs Section */}
            {otherFilteredJobs.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Recommended Roles</h2>
                  <div className="h-px flex-1 bg-white/10"></div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 border border-white/10">
                    {otherFilteredJobs.length} NEW OPPORTUNIT{otherFilteredJobs.length !== 1 ? 'IES' : 'Y'}
                  </span>
                </div>
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                  {otherFilteredJobs.map(job => (
                    <JobCard
                      key={job._id}
                      job={job}
                      userRole={user?.role}
                      onApply={handleApplySuccess}
                      isApplied={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}