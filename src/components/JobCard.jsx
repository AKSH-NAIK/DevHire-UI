'use client';

import { Link } from 'react-router-dom'
import { MapPin, Briefcase, Badge, Users, Flag } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function JobCard({ job, userRole, onApply, isApplied = false }) {
  const initials = job.company
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = Math.abs(today - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleApplyClick = (e) => {
    e.preventDefault()
    if (userRole === 'recruiter') {
      toast.error('Recruiters cannot apply for jobs.')
      return
    }
    onApply(job.id)
  }

  return (
    <div className="bg-black border border-white/10 rounded-none p-6 hover:border-primary/50 transition-all group hover:shadow-glow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 border border-white/10 rounded-none flex items-center justify-center text-primary font-bold text-lg group-hover:border-primary group-hover:shadow-glow-sm transition-all">
            {initials}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg line-clamp-2 tracking-tight">{job.title}</h3>
            <p className="text-slate-500 text-sm font-medium">{job.company}</p>
          </div>
        </div>
        {job.verified && (
          <div className="px-2 py-0.5 border border-primary/30 text-primary text-[10px] uppercase tracking-widest font-bold bg-primary/5">
            Verified
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-y-3 mb-6">
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-tight font-medium">
          <MapPin size={14} className="text-primary" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-tight font-medium">
          <Briefcase size={14} className="text-primary" />
          {job.type}
        </div>
        <div className="col-span-2 flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
          <span>{job.salary}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">{job.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {job.requirements.slice(0, 3).map((req, idx) => (
          <span
            key={idx}
            className="px-3 py-1 border border-white/5 bg-white/5 rounded-none text-slate-400 text-[10px] uppercase font-bold tracking-widest"
          >
            {req}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-5 border-t border-white/5">
        <div className="flex items-center gap-2 text-slate-500 text-[10px] items-center uppercase font-bold tracking-widest leading-none">
          <Users size={14} className="text-primary" />
          {job.applicants} applicants
        </div>
        <div className="flex items-center gap-3">
          {(!userRole || userRole === 'candidate') && (
            <>
              <button
                onClick={handleApplyClick}
                disabled={isApplied}
                className={`px-6 py-2 border transition-all text-xs font-bold uppercase tracking-widest ${isApplied
                  ? 'border-white/10 text-slate-600 cursor-not-allowed'
                  : 'border-primary text-primary hover:bg-primary hover:text-white'
                  }`}
              >
                {isApplied ? 'Applied' : 'Apply'}
              </button>
              <button className="p-2 text-slate-500 hover:text-white transition-colors border border-transparent hover:border-white/10">
                <Flag size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="text-slate-600 text-[10px] mt-4 uppercase font-bold tracking-widest">Posted {formatDate(job.postedAt)}</div>
    </div>
  )
}
