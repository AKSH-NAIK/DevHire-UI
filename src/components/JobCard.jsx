'use client';

import { useState } from 'react'
import { Users, Flag } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { authService } from '../services/authService'
import StatusBadge from './StatusBadge'
import ApplyJobModal from './ApplyJobModal'
import ReportJobModal from './ReportJobModal'
import { motion } from 'framer-motion'

export default function JobCard({ job, userRole: propUserRole, onApply, isApplied = false, status, showActions = true }) {
  const user = authService.getCurrentUser()
  const activeUserRole = propUserRole || user?.role
  const [applyOpen, setApplyOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  const formatSalary = (value) => {
    if (value === null || value === undefined || value === '') return null
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) return null
    return numericValue.toLocaleString('en-IN')
  }

  const salaryMin = formatSalary(job.salaryMin)
  const salaryMax = formatSalary(job.salaryMax)
  const salaryPeriodLabel = job.salaryPeriod === 'Yearly' ? 'yr' : job.salaryPeriod === 'Monthly' ? 'mo' : job.salaryPeriod
  const jobTypeLabel = job.type || 'Full-Time'

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const postedDate = formatDate(job.createdAt)

  const handleApplyClick = (e) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    if (activeUserRole === 'recruiter') {
      toast.error('/ you cannot apply for jobs .')
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

  const handleApplySuccess = () => {
    onApply?.(job.id)
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -5, borderColor: 'rgba(245, 158, 11, 0.5)' }}
        className="relative overflow-hidden rounded-[26px] border border-[#262626] bg-[#121212] px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-300 hover:border-[#3a3a3a]"
      >
        <div className="absolute inset-0 rounded-[26px] border border-[#1e1e1e]" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-[20px] font-semibold leading-tight tracking-[-0.03em] text-zinc-100 line-clamp-2 sm:text-[21px]">
              {job.title}
            </h3>
            <p className="mt-2 text-[15px] leading-snug text-[#9ca3af]">
              {job.company || 'Company not listed'} • {job.location || 'Location not listed'}
            </p>
          </div>

          <span className="flex-shrink-0 rounded-full border border-[#3c3c3c] bg-[#161616] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-[#e5e7eb]">
            {jobTypeLabel}
          </span>
        </div>

        <div className="relative mt-8 border-t border-[#262626] pt-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[18px] font-semibold tracking-[-0.03em] text-[#f5c84c] sm:text-[20px]">
                {salaryMin && salaryMax
                  ? `₹${salaryMin} - ₹${salaryMax}`
                  : job.salary || 'Salary not disclosed'}
              </p>
              {(salaryPeriodLabel || job.salaryPeriod) && (
                <p className="mt-1 text-[18px] font-semibold uppercase tracking-[-0.03em] text-[#f5c84c] sm:text-[20px]">
                  / {salaryPeriodLabel || job.salaryPeriod}
                </p>
              )}
            </div>

            <p className="max-w-[155px] text-right text-[11px] font-semibold uppercase tracking-[0.45em] text-[#7f8792] sm:max-w-none sm:text-[12px]">
              Posted {postedDate}
            </p>
          </div>

          {showActions && (
            <div className="mt-6 flex items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 min-h-[32px]">
                {activeUserRole === 'recruiter' && (
                  <>
                    <Users size={14} className="text-amber-400" />
                    {job.applicants || 0} applicants
                  </>
                )}

                {activeUserRole === 'candidate' && isApplied && job.createdBy?.email && (
                  <a
                    href={`mailto:${job.createdBy.email}`}
                    className="rounded-md border border-amber-500/50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-300 transition hover:bg-amber-500 hover:text-zinc-950"
                  >
                    Contact Recruiter
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                {(!activeUserRole || activeUserRole === 'candidate') && (
                  <>
                    {isApplied ? (
                      <StatusBadge status={status || 'pending'} />
                    ) : (
                      <button
                        onClick={handleApplyClick}
                        className="rounded-md border border-amber-500 bg-amber-500 px-5 py-2 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-amber-400"
                        aria-label={`Apply for ${job.title} at ${job.company}`}
                      >
                        Apply Now
                      </button>
                    )}
                    <button
                      onClick={handleReportClick}
                      title="Report this job"
                      aria-label={`Report ${job.title} job at ${job.company}`}
                      className="rounded-md border border-transparent p-2 text-zinc-500 transition-colors hover:border-red-900/40 hover:text-red-400"
                    >
                      <Flag size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <ApplyJobModal
        isOpen={applyOpen}
        onClose={() => setApplyOpen(false)}
        job={job}
        user={user}
        onApplySuccess={handleApplySuccess}
      />

      <ReportJobModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        job={job}
        user={user}
      />
    </>
  )
}
