'use client';

import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Modal from './Modal'
import { ButtonSpinner } from './Loader'
import { jobsService } from '../services/jobsService'

// ── Centralized validation ──────────────────────────────────────────────────
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/

function validateApplyForm({ name, email, phone, coverLetter, resume }) {
    const errors = {}
    if (!name.trim()) errors.name = 'Full name is required'
    if (!email.trim()) errors.email = 'Email is required'
    if (!phone.trim()) {
        errors.phone = 'Phone number is required'
    } else if (!PHONE_REGEX.test(phone.trim())) {
        errors.phone = 'Enter a valid phone number'
    }
    if (!coverLetter.trim()) {
        errors.coverLetter = 'Cover letter is required'
    } else if (coverLetter.trim().length < 50) {
        errors.coverLetter = `Too short — ${50 - coverLetter.trim().length} more characters needed`
    }
    if (!resume) {
        errors.resume = 'Resume (PDF) is required'
    }
    return errors
}

// ── Field components ────────────────────────────────────────────────────────
function FieldError({ msg }) {
    if (!msg) return null
    return <p className="mt-1.5 text-red-400 text-[10px] font-bold uppercase tracking-widest">{msg}</p>
}

function InputField({ label, required, error, ...props }) {
    return (
        <div>
            <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                {...props}
                className={`w-full px-4 py-3 bg-black border ${error ? 'border-red-800' : 'border-white/10'} text-white placeholder-slate-700 focus:outline-none focus:border-primary focus:shadow-glow-sm transition-all text-sm`}
            />
            <FieldError msg={error} />
        </div>
    )
}

// ── Resume drop zone ────────────────────────────────────────────────────────
function ResumeDropZone({ resume, setResume, error }) {
    const inputRef = useRef(null)
    const [dragging, setDragging] = useState(false)
    const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

    const processFile = useCallback((file) => {
        if (!file) return
        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are accepted')
            return
        }
        if (file.size > MAX_SIZE) {
            toast.error('File size must be under 5 MB')
            return
        }
        setResume(file)
    }, [setResume])

    const handleDrop = (e) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files?.[0]
        processFile(file)
    }

    return (
        <div>
            <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
                Resume (PDF) <span className="text-red-500">*</span>
            </label>

            {resume ? (
                <div className="flex items-center gap-3 px-4 py-3 border border-primary/30 bg-primary/5">
                    <FileText size={16} className="text-primary flex-shrink-0" />
                    <span className="text-white text-sm flex-1 truncate">{resume.name}</span>
                    <button
                        type="button"
                        onClick={() => setResume(null)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 py-8 border ${dragging ? 'border-primary bg-primary/5' : error ? 'border-red-800' : 'border-white/10 border-dashed'
                        } cursor-pointer hover:border-primary/50 transition-all`}
                >
                    <Upload size={24} className={dragging ? 'text-primary' : 'text-slate-600'} />
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        Drag & drop or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-slate-700 text-[10px] uppercase tracking-widest">PDF only · Max 5 MB</p>
                    <input
                        ref={inputRef}
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => processFile(e.target.files?.[0])}
                    />
                </div>
            )}
            <FieldError msg={error} />
        </div>
    )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ApplyJobModal({ isOpen, onClose, job, user, onApplySuccess }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        coverLetter: '',
    })
    const [resume, setResume] = useState(null)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const coverLength = formData.coverLetter.trim().length

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear field error on change
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validateApplyForm({ ...formData, resume })
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setLoading(true)
        try {
            // Apply to job via service
            jobsService.applyToJob(job.id, user.id, {
                applicantName: formData.name,
                applicantEmail: formData.email,
                phone: formData.phone,
                coverLetter: formData.coverLetter,
                resumeName: resume.name,
            })
            setSubmitted(true)
            onApplySuccess?.(job.id)
            toast.success('Application submitted successfully! 🎉')
            setTimeout(() => { onClose(); setSubmitted(false) }, 1500)
        } catch (err) {
            if (err.message?.toLowerCase().includes('already applied')) {
                toast.error('You have already applied to this job.')
            } else {
                toast.error(err.message || 'Something went wrong. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Reset on close
    const handleClose = () => {
        if (loading) return
        setErrors({})
        setSubmitted(false)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Apply for Position" maxWidth="max-w-xl">
            {/* Job info bar */}
            <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <p className="text-white font-bold text-sm tracking-tight">{job?.title}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-0.5">{job?.company} · {job?.location}</p>
            </div>

            {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
                    <CheckCircle size={48} className="text-green-500" />
                    <p className="text-white font-bold uppercase tracking-widest text-sm">Application Submitted!</p>
                    <p className="text-slate-500 text-xs text-center">We'll review your application and get back to you.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
                    <InputField
                        label="Full Name"
                        required
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                    />

                    <InputField
                        label="Email Address"
                        required
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        readOnly
                        error={errors.email}
                        className="opacity-60 cursor-not-allowed"
                    />

                    <InputField
                        label="Phone Number"
                        required
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                    />

                    {/* Cover Letter */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                Cover Letter <span className="text-red-500">*</span>
                            </label>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${coverLength >= 50 ? 'text-green-500' : 'text-slate-600'}`}>
                                {coverLength}/50 min
                            </span>
                        </div>
                        <textarea
                            name="coverLetter"
                            value={formData.coverLetter}
                            onChange={handleChange}
                            placeholder="Tell us why you're a great fit for this role. Highlight your relevant experience and skills..."
                            rows={5}
                            className={`w-full px-4 py-3 bg-black border ${errors.coverLetter ? 'border-red-800' : 'border-white/10'} text-white placeholder-slate-700 focus:outline-none focus:border-primary transition-all text-sm resize-none`}
                        />
                        <FieldError msg={errors.coverLetter} />
                    </div>

                    {/* Resume Upload */}
                    <ResumeDropZone resume={resume} setResume={setResume} error={errors.resume} />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-4 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <><ButtonSpinner /> Submitting...</>
                        ) : 'Submit Application'}
                    </button>

                    <p className="text-slate-700 text-[10px] text-center uppercase tracking-widest">
                        By submitting you agree to our terms of service
                    </p>
                </form>
            )}
        </Modal>
    )
}
