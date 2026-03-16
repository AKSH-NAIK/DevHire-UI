'use client';

import { useState } from 'react'
import { Flag, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { ButtonSpinner } from './Loader'
import { jobsService } from '../services/jobsService'

// ── Validation ───────────────────────────────────────────────────────────────
function validateReportForm({ reason, description }) {
    const errors = {}
    if (!reason) errors.reason = 'Please select a reason'
    if (!description.trim()) {
        errors.description = 'Description is required'
    } else if (description.trim().length < 20) {
        errors.description = `Too short — ${20 - description.trim().length} more characters needed`
    }
    return errors
}

const REPORT_REASONS = [
    { value: '', label: 'Select a reason...' },
    { value: 'fake_job', label: 'Fake Job' },
    { value: 'scam', label: 'Scam / Fraud' },
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'duplicate', label: 'Duplicate Listing' },
    { value: 'other', label: 'Other' },
]

function FieldError({ msg }) {
    if (!msg) return null
    return <p className="mt-1.5 text-red-400 text-[10px] font-bold uppercase tracking-widest">{msg}</p>
}

export default function ReportJobModal({ isOpen, onClose, job, user }) {
    const [formData, setFormData] = useState({ reason: '', description: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const descLength = formData.description.trim().length

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validateReportForm(formData)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setLoading(true)
        try {
            // Submit report — does NOT hide/block job or recruiter
            jobsService.submitReport({
                jobId: job.id,
                jobTitle: job.title,
                reporterId: user?.id,
                reason: formData.reason,
                description: formData.description,
                reportedAt: new Date().toISOString(),
                status: 'pending_review',
            })
            setSubmitted(true)
            toast.success('Report submitted. Our team will review it.')
            setTimeout(() => { onClose(); setSubmitted(false); setFormData({ reason: '', description: '' }) }, 1800)
        } catch (err) {
            toast.error(err.message || 'Failed to submit report. Try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (loading) return
        setErrors({})
        setSubmitted(false)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Report Job Listing" maxWidth="max-w-md">
            {/* Job info */}
            <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <p className="text-white font-bold text-sm tracking-tight">{job?.title}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-0.5">{job?.company}</p>
            </div>

            {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
                    <CheckCircle size={48} className="text-green-500" />
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Report Received</p>
                    <p className="text-slate-500 text-xs text-center max-w-xs">
                        Thank you for reporting. Our moderation team will review it within 24–48 hours.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
                    {/* Info note */}
                    <div className="flex items-start gap-3 px-4 py-3 border border-yellow-900/40 bg-yellow-950/20">
                        <Flag size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-yellow-400/80 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Reports are reviewed by our team. The job listing remains visible until reviewed.
                        </p>
                    </div>

                    {/* Reason dropdown */}
                    <div>
                        <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                            Reason <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                className={`w-full appearance-none px-4 py-3 bg-[#2A2A2A] border ${errors.reason ? 'border-red-800' : 'border-white/10'} text-white focus:outline-none focus:border-primary transition-all text-sm cursor-pointer`}
                            >
                                {REPORT_REASONS.map(r => (
                                    <option key={r.value} value={r.value} disabled={!r.value} className="bg-[#2A2A2A]">
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-xs">▼</div>
                        </div>
                        <FieldError msg={errors.reason} />
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${descLength >= 20 ? 'text-green-500' : 'text-slate-600'}`}>
                                {descLength}/20 min
                            </span>
                        </div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue in detail so our team can investigate effectively..."
                            rows={4}
                            className={`w-full px-4 py-3 bg-[#2A2A2A] border ${errors.description ? 'border-red-800' : 'border-white/10'} text-white placeholder-slate-700 focus:outline-none focus:border-primary transition-all text-sm resize-none`}
                        />
                        <FieldError msg={errors.description} />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 border border-red-500/70 text-red-400 hover:bg-red-950/40 hover:border-red-500 transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><ButtonSpinner /> Submitting...</>
                        ) : (
                            <><Flag size={14} /> Submit Report</>
                        )}
                    </button>
                </form>
            )}
        </Modal>
    )
}
