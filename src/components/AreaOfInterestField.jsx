import { useState, useRef, useEffect } from 'react'
import { X, ChevronDown } from 'lucide-react'

const JOB_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Mobile Developer',
  'UI/UX Designer',
  'Product Manager',
  'QA Engineer',
  'Machine Learning Engineer',
  'Cloud Architect',
  'Security Engineer',
  'Game Developer',
  'Data Analyst',
]

export default function AreaOfInterestField({ value = [], onChange }) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = JOB_ROLES.filter(
        (role) =>
          role.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(role)
      )
      setSuggestions(filtered)
      setIsOpen(true)
    } else {
      setSuggestions(JOB_ROLES.filter((role) => !value.includes(role)))
      setIsOpen(false)
    }
  }, [inputValue, value])

  // Handle clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectRole = (role) => {
    if (value.length < 3) {
      onChange([...value, role])
      setInputValue('')
      setIsOpen(false)
      inputRef.current?.focus()
    }
  }

  const handleRemoveRole = (role) => {
    onChange(value.filter((r) => r !== role))
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault()
      handleSelectRole(suggestions[0])
    }
  }

  return (
    <div ref={containerRef} className="space-y-3">
      <label className="block text-sm font-medium text-white">
        Area of Interest
        <span className="text-cyan-400 ml-1">
          ({value.length}/3)
        </span>
      </label>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-[2.5rem] flex-col justify-center">
        {value.length > 0 ? (
          value.map((role) => (
            <div
              key={role}
              className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/50 rounded px-3 py-1.5 text-sm text-cyan-200"
            >
              {role}
              <button
                type="button"
                onClick={() => handleRemoveRole(role)}
                className="hover:text-cyan-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))
        ) : (
          <span className="text-slate-500 text-sm italic">
            Select up to 3 roles
          </span>
        )}
      </div>

      {/* Input Field */}
      <div className="relative">
        <div className="flex items-center bg-slate-900/30 border border-cyan-500/50 rounded focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={
              value.length >= 3
                ? 'Maximum selections reached'
                : 'Type to search roles...'
            }
            disabled={value.length >= 3}
            className="flex-1 px-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <ChevronDown
            size={18}
            className={`mr-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </div>

        {/* Dropdown Suggestions */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
            {suggestions.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleSelectRole(role)}
                className="w-full text-left px-4 py-3 hover:bg-cyan-500/20 border-b border-slate-700/50 last:border-b-0 text-slate-300 hover:text-cyan-300 transition-colors text-sm"
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {/* No suggestions message */}
        {isOpen && suggestions.length === 0 && inputValue && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded p-3 text-slate-400 text-sm text-center z-50">
            No matching roles found
          </div>
        )}
      </div>


    </div>
  )
}
