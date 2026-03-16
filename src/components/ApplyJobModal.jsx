'use client';

import { applyToJob } from "../services/applicationService";
import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import { ButtonSpinner } from './Loader';

// ── Centralized validation ──────────────────────────────────────────────────
const PHONE_REGEX = /^[+]?[\d\s\-().]{7,20}$/;

function validateApplyForm({ name, email, phone, coverLetter, resume }) {
    const errors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!phone.trim()) {
        errors.phone = 'Phone number is required';
    } else if (!PHONE_REGEX.test(phone.trim())) {
        errors.phone = 'Enter a valid phone number';
    }
    if (!coverLetter.trim()) {
        errors.coverLetter = 'Cover letter is required';
    } else if (coverLetter.trim().length < 20) {
        errors.coverLetter = `Too short — ${20 - coverLetter.trim().length} more characters needed`;
    }
    if (!resume) {
        errors.resume = 'Resume (PDF) is required';
    }
    return errors;
}

// ── Field error ─────────────────────────────────────────────────────────────
function FieldError({ msg }) {
    if (!msg) return null;
    return (
        <p className="mt-1.5 text-red-400 text-[10px] font-bold uppercase tracking-widest">
            {msg}
        </p>
    );
}

// ── Resume drop zone ────────────────────────────────────────────────────────
function ResumeDropZone({ resume, setResume, error }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const MAX_SIZE = 5 * 1024 * 1024;

    const processFile = useCallback((file) => {
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are accepted');
            return;
        }

        if (file.size > MAX_SIZE) {
            toast.error('File size must be under 5 MB');
            return;
        }

        setResume(file);
    }, [setResume]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        processFile(file);
    };

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
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 py-8 border ${dragging
                        ? 'border-primary bg-primary/5'
                        : error
                            ? 'border-red-800'
                            : 'border-white/10 border-dashed'
                        } cursor-pointer hover:border-primary/50 transition-all`}
                >
                    <Upload size={24} className={dragging ? 'text-primary' : 'text-slate-600'} />
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        Drag & drop or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-slate-700 text-[10px] uppercase tracking-widest">
                        PDF only · Max 5 MB
                    </p>
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
    );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ApplyJobModal({ isOpen, onClose, job, user, onApplySuccess }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        coverLetter: '',
    });

    const [resume, setResume] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const coverLength = formData.coverLetter.trim().length;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateApplyForm({ ...formData, resume });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            await applyToJob(job._id, resume, formData.phone, formData.coverLetter);

            setSubmitted(true);
            onApplySuccess?.(job._id);

            toast.success('Application submitted successfully!');

            setTimeout(() => {
                onClose();
                setSubmitted(false);
            }, 1500);

        } catch (err) {
            console.error(err);

            if (err.response?.data?.message?.toLowerCase().includes('already')) {
                toast.error('You have already applied to this job.');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setErrors({});
        setSubmitted(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Apply for Position" maxWidth="max-w-xl">
            <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <p className="text-white font-bold text-sm tracking-tight">{job?.title}</p>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mt-0.5">
                    {job?.company} · {job?.location}
                </p>
            </div>

            {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
                    <CheckCircle size={48} className="text-green-500" />
                    <p className="text-white font-bold uppercase tracking-widest text-sm">
                        Application Submitted!
                    </p>
                    <p className="text-slate-500 text-xs text-center">
                        We'll review your application and get back to you.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">

                    {/* Full Name */}
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-white/10 text-white"
                    />

                    {/* Phone */}
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-white/10 text-white"
                    />

                    {/* Cover Letter */}
                    <textarea
                        name="coverLetter"
                        value={formData.coverLetter}
                        onChange={handleChange}
                        placeholder="Explain why you are a good fit for this job (20 letters minimum)"
                        rows={5}
                        className="w-full px-4 py-3 bg-[#2A2A2A] border border-white/10 text-white resize-none"
                    />

                    {/* Resume Upload */}
                    <ResumeDropZone resume={resume} setResume={setResume} error={errors.resume} />

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-40"
                    >
                        {loading ? <><ButtonSpinner /> Submitting...</> : 'Submit Application'}
                    </button>
                </form>
            )}
        </Modal>
    );
}