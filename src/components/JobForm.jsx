'use client';

import { useState } from 'react'
import { ButtonSpinner } from './Loader'

// Per-field validation
function validate(fields) {
  const errors = {}
  if (!fields.title.trim()) errors.title = 'Job title is required'
  if (!fields.location.trim()) errors.location = 'Location is required'
  if (!fields.salary.trim()) errors.salary = 'Salary range is required'
  if (!fields.description.trim()) errors.description = 'Description is required'
  if (!fields.requirements.trim()) errors.requirements = 'Requirements are required'
  return errors
}

function FieldError({ msg }) {
  if (!msg) return null
  return <p className="mt-1 text-red-400 text-[10px] font-bold uppercase tracking-widest">{msg}</p>
}

export default function JobForm({ initialData = null, onSubmit, loading = false }) {
  const [formData, setFormData] = useState(
    initialData || { title: '', location: '', salary: '', type: 'Full-time', description: '', requirements: '' }
  )
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const fieldErrors = validate(formData)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      const firstError = Object.values(fieldErrors)[0]
      toast.error(firstError)
      return
    }
    const requirements = formData.requirements.split(',').map(r => r.trim()).filter(Boolean)
    try {
      onSubmit({ ...formData, requirements })
    } catch (err) {
      console.error('JobForm onSubmit error:', err)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-black border ${errors[field] ? 'border-red-800 focus:border-red-500' : 'border-white/10 focus:border-primary'} text-white placeholder-slate-600 focus:outline-none focus:shadow-glow-sm transition-all text-sm`

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Title */}
        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior React Developer"
            className={inputClass('title')}
            disabled={loading}
          />
          <FieldError msg={errors.title} />
        </div>

        {/* Location */}
        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA or Remote"
            className={inputClass('location')}
            disabled={loading}
          />
          <FieldError msg={errors.location} />
        </div>

        {/* Salary */}
        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
            Salary Range <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g., $80,000 – $120,000"
            className={inputClass('salary')}
            disabled={loading}
          />
          <FieldError msg={errors.salary} />
        </div>

        {/* Job Type */}
        <div>
          <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
            Job Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full appearance-none px-4 py-3 bg-black border border-white/10 text-white focus:outline-none focus:border-primary transition-all text-sm cursor-pointer"
              disabled={loading}
            >
              {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => (
                <option key={t} value={t} className="bg-black">{t}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-[10px]">▼</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the role, responsibilities, and what you're looking for..."
          rows={5}
          className={`${inputClass('description')} resize-none`}
          disabled={loading}
        />
        <FieldError msg={errors.description} />
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">
          Required Skills <span className="text-red-500">*</span>
          <span className="text-slate-600 ml-2 normal-case">(comma-separated)</span>
        </label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="e.g., React, TypeScript, Node.js, 5+ years experience"
          rows={3}
          className={`${inputClass('requirements')} resize-none`}
          disabled={loading}
        />
        <FieldError msg={errors.requirements} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? <><ButtonSpinner /> Saving...</> : initialData ? 'Update Job' : 'Post Job'}
      </button>
    </form>
  )
}
