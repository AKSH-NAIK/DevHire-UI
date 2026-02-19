'use client';

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

export default function JobForm({ initialData = null, onSubmit, loading = false }) {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      location: '',
      salary: '',
      type: 'Full-time',
      description: '',
      requirements: '',
    }
  )
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Job title is required')
      return
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      return
    }
    if (!formData.salary.trim()) {
      setError('Salary range is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Job description is required')
      return
    }
    if (!formData.requirements.trim()) {
      setError('Requirements are required (comma-separated)')
      return
    }

    const requirements = formData.requirements
      .split(',')
      .map(r => r.trim())
      .filter(r => r)

    onSubmit({
      ...formData,
      requirements,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-3 flex gap-2 text-red-400 text-sm">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-medium mb-2">Job Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior React Developer"
            className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., San Francisco, CA"
            className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Salary Range *</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g., $120,000 - $160,000"
            className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Job Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600 rounded text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the job, responsibilities, and what you're looking for..."
          rows="6"
          className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-white font-medium mb-2">Required Skills (comma-separated) *</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="e.g., React, TypeScript, Node.js, 5+ years experience"
          rows="3"
          className="w-full px-4 py-3 bg-slate-900/30 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors resize-none"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded transition-colors disabled:opacity-50"
      >
        {loading ? 'Saving...' : initialData ? 'Update Job' : 'Post Job'}
      </button>
    </form>
  )
}
