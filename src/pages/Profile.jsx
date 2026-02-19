import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Globe, Briefcase, Plus, Save, Edit2, X, FileText, Layout, CheckCircle2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { authService } from '../services/authService'
import AreaOfInterestField from '../components/AreaOfInterestField'

export default function Profile() {
    const navigate = useNavigate()
    const user = authService.getCurrentUser()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        companyName: '',
        email: '',
        password: '',
        website: '',
        logo: '',
        resume: '',
        skills: [],
        areaOfInterest: [],
    })

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }
        setFormData({
            ...user,
            password: user.password || '',
            skills: user.skills || [],
            areaOfInterest: user.areaOfInterest || [],
            website: user.website || '',
            logo: user.logo || '',
            resume: user.resume || '',
        })
    }, [user, navigate])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSkillsChange = (e) => {
        const skills = e.target.value.split(',').map((skill) => skill.trim()).filter(Boolean)
        setFormData((prev) => ({ ...prev, skills }))
    }

    const handleAOIChange = (areas) => {
        setFormData((prev) => ({ ...prev, areaOfInterest: areas }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            authService.updateUser(user.id, formData)
            toast.success('Profile updated successfully!')
            setIsEditing(false)
        } catch (error) {
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    const isCandidate = user.role === 'candidate'

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-black">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-none border-2 border-primary/30 flex items-center justify-center bg-primary/5 text-primary shadow-glow-sm">
                            {isCandidate ? <User size={48} /> : <Briefcase size={48} />}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">
                                {isCandidate ? formData.name : formData.companyName}
                            </h1>
                            <p className="text-slate-400 mt-1 capitalize">{user.role} Account</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-2 px-6 py-2.5 transition-all text-sm font-semibold uppercase tracking-wider ${isEditing
                                ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white'
                                : 'bg-primary/10 text-primary border border-primary/50 hover:bg-primary hover:text-white'
                            }`}
                    >
                        {isEditing ? (
                            <>
                                <X size={18} /> Cancel
                            </>
                        ) : (
                            <>
                                <Edit2 size={18} /> Edit Profile
                            </>
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
                    {/* Sidebar / Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-none">
                            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Contact Info</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="text-slate-500 shrink-0" size={18} />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-tighter">Email</p>
                                        <p className="text-slate-200 break-all">{formData.email}</p>
                                    </div>
                                </div>
                                {!isCandidate && formData.website && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="text-slate-500 shrink-0" size={18} />
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-tighter">Website</p>
                                            <a href={formData.website} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                                                {formData.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isCandidate && (
                            <div className="bg-slate-900/50 border border-white/5 p-6 rounded-none">
                                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Resume</h3>
                                {formData.resume ? (
                                    <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20">
                                        <FileText className="text-primary" size={20} />
                                        <a href={formData.resume} target="_blank" rel="noreferrer" className="text-sm text-slate-200 hover:text-white truncate">
                                            View Documents
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No resume added yet</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main Form/Details */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="bg-slate-900/30 border border-white/5 p-8 rounded-none space-y-6">
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {isEditing ? 'Update Your Information' : 'Public Profile Details'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Common Fields */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">
                                            {isCandidate ? 'Full Name' : 'Company Name'}
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name={isCandidate ? 'name' : 'companyName'}
                                                value={isCandidate ? formData.name : formData.companyName}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-none px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all shadow-glow-sm"
                                                required
                                            />
                                        ) : (
                                            <p className="text-lg text-white font-medium">{isCandidate ? formData.name : formData.companyName}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Email Address</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-none px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all shadow-glow-sm"
                                                required
                                            />
                                        ) : (
                                            <p className="text-lg text-white font-medium">{formData.email}</p>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400">Password</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-none px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all shadow-glow-sm"
                                            />
                                        </div>
                                    )}

                                    {/* Recruiter Specific Fields */}
                                    {!isCandidate && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-400">Website URL</label>
                                                {isEditing ? (
                                                    <input
                                                        type="url"
                                                        name="website"
                                                        value={formData.website}
                                                        onChange={handleInputChange}
                                                        placeholder="https://example.com"
                                                        className="w-full bg-slate-900/50 border border-white/10 rounded-none px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all shadow-glow-sm"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-white font-medium">{formData.website || 'N/A'}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-400">Logo URL</label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="logo"
                                                        value={formData.logo}
                                                        onChange={handleInputChange}
                                                        placeholder="https://link-to-logo.com"
                                                        className="w-full bg-slate-900/50 border border-white/10 rounded-none px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all shadow-glow-sm"
                                                    />
                                                ) : (
                                                    <p className="text-lg text-white font-medium truncate max-w-[200px]">{formData.logo || 'N/A'}</p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Candidate Specific Fields */}
                                    {isCandidate && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-400">Resume URL</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="resume"
                                                    value={formData.resume}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-900/50 border border-white/10 rounded-none px-4 py-2.5 text-white focus:border-primary focus:outline-none transition-all shadow-glow-sm"
                                                    placeholder="Link to your PDF or Google Drive"
                                                />
                                            ) : (
                                                <p className="text-lg text-white font-medium truncate max-w-[200px]">{formData.resume || 'Not uploaded'}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {isCandidate && (
                                    <div className="space-y-6 pt-6 border-t border-white/5">
                                        <div className="space-y-3">
                                            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                                <Plus size={16} /> Skills (comma separated)
                                            </label>
                                            {isEditing ? (
                                                <textarea
                                                    value={formData.skills.join(', ')}
                                                    onChange={handleSkillsChange}
                                                    rows={3}
                                                    className="w-full bg-slate-900/50 border border-white/10 rounded-none px-4 py-3 text-white focus:border-primary focus:outline-none transition-all shadow-glow-sm resize-none"
                                                    placeholder="React, Tailwind CSS, Node.js..."
                                                />
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.skills.length > 0 ? (
                                                        formData.skills.map((skill, i) => (
                                                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-slate-300 text-sm">
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-slate-500 italic text-sm">No skills listed</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            {isEditing ? (
                                                <AreaOfInterestField
                                                    value={formData.areaOfInterest}
                                                    onChange={handleAOIChange}
                                                />
                                            ) : (
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-400">Areas of Interest</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {formData.areaOfInterest.length > 0 ? (
                                                            formData.areaOfInterest.map((role, i) => (
                                                                <span key={i} className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium">
                                                                    {role}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-slate-500 italic text-sm">No areas specified</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isEditing && (
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-primary text-black font-bold py-4 px-6 hover:bg-primary-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group uppercase tracking-widest text-sm"
                                        >
                                            {loading ? (
                                                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Save Profile Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
