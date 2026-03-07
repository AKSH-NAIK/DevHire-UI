'use client';

import { useState } from 'react'
import { MapPin, Briefcase, Users, Flag } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { authService } from '../services/authService'
import StatusBadge from './StatusBadge'
import ApplyJobModal from './ApplyJobModal'
import ReportJobModal from './ReportJobModal'
import { motion } from 'framer-motion'

export default function JobCard({ job, userRole, onApply, isApplied = false, status }) {
  const user = authService.getCurrentUser()
  const [applyOpen, setApplyOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [expandSkills, setExpandSkills] = useState(false)

  const initials = (job.company || 'Unknown')
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffDays = Math.ceil(Math.abs(today - date) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleApplyClick = (e) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    if (userRole === 'recruiter') {
      toast.error('Recruiters cannot apply for jobs.')
      return
    }
    if (isApplied) { toast('You have already applied to this job.', { icon: '⚠️' }); return }
    setApplyOpen(true)
  }

  const handleReportClick = (e) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    setReportOpen(true)
  }

  // Called by ApplyJobModal on successful apply
  const handleApplySuccess = () => {
    onApply?.(job.id)
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.5)' }}
        className="glass p-6 transition-all duration-200 group flex flex-col rounded-2xl h-full border border-white/10"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 border border-white/10 flex items-center justify-center text-primary font-bold text-lg group-hover:border-primary/60 group-hover:shadow-glow-sm transition-all flex-shrink-0 rounded-xl bg-white/5">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg line-clamp-2 tracking-tight group-hover:text-primary transition-colors">{job.title}</h3>
              <p className="text-slate-500 text-sm font-medium">{job.company}</p>
            </div>
          </div>
          {job.verified && (
            <div className="px-2 py-0.5 border border-primary/30 text-primary text-[10px] uppercase tracking-widest font-bold bg-primary/5 flex-shrink-0 ml-2 rounded-md">
              Verified
            </div>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-y-3 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-tight font-medium">
            <MapPin size={14} className="text-primary flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-tight font-medium">
            <Briefcase size={14} className="text-primary flex-shrink-0" />
            {job.type}
          </div>
          <div className="col-span-2 flex items-center gap-1.5">
            <span className="text-primary font-bold text-lg">₹</span>
            <span className="text-primary font-bold text-lg tracking-tight">{job.salary}</span>
            {job.salaryPeriod && (
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest border border-white/10 bg-white/5 px-2 py-0.5 rounded-md ml-1">/ {job.salaryPeriod}</span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed flex-1">
          {job.description
            ?.replace(/Ananlysis/g, 'Analysis')
            ?.replace(/ ,/g, ',')}
        </p>

        {/* Requirement tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(expandSkills ? (job.requirements || []) : (job.requirements || []).slice(0, 3)).map((req, idx) => (
            <span
              key={idx}
              className="px-3 py-1 border border-white/5 bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-widest rounded-md"
            >
              {req}
            </span>
          ))}
          {job.requirements?.length > 3 && (
            <button
              onClick={() => setExpandSkills(!expandSkills)}
              className="px-3 py-1 text-primary hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest border border-white/5 bg-white/5 hover:bg-primary/10 rounded-md"
            >
              {expandSkills ? 'Show Less' : `+${job.requirements.length - 3} more`}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-5 border-t border-white/5">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-widest min-h-[32px]">
            {/* Show applicants ONLY for recruiters */}
            {userRole === 'recruiter' && (
              <>
                <Users size={14} className="text-primary" />
                {job.applicants || 0} applicants
              </>
            )}

            {/* If applied candidate, show Contact Recruiter on the left */}
            {userRole === 'candidate' && isApplied && job.createdBy?.email && (
              <a
                href={`mailto:${job.createdBy.email}`}
                className="text-[10px] border border-primary/50 px-3 py-1.5 uppercase font-bold tracking-widest text-primary hover:bg-primary hover:text-black transition flex-shrink-0 rounded-md"
              >
                Contact Recruiter
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Candidates: Apply + Report */}
            {(!userRole || userRole === 'candidate') && (
              <>
                {isApplied ? (
                  <StatusBadge status={status || 'pending'} />
                ) : (
                  <button
                    onClick={handleApplyClick}
                    className="px-5 py-2 border border-primary text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold uppercase tracking-widest rounded-md"
                  >
                    Apply
                  </button>
                )}
                <button
                  onClick={handleReportClick}
                  title="Report this job"
                  className="p-2 text-slate-600 hover:text-red-400 transition-colors border border-transparent hover:border-red-900/40"
                >
                  <Flag size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="text-slate-700 text-[10px] mt-3 uppercase font-bold tracking-widest">
          Posted {formatDate(job.createdAt)}
        </div>
      </motion.div>

      {/* Apply Modal */}
      <ApplyJobModal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        job={job}
        user={user}
        onApplySuccess={handleApplySuccess}
      />

      {/* Report Modal */}
      <ReportJobModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        job={job}
        user={user}
      />
    </>
  )
}
