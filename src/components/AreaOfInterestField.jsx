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
      <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-2">
        Area of Interest
        <span className="text-primary ml-2 opacity-60">
          ({value.length}/3)
        </span>
      </label>

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[1.5rem] mt-2">
        {value.length > 0 ? (
          value.map((role) => (
            <div
              key={role}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary shadow-glow-primary/5"
            >
              {role}
              <button
                type="button"
                onClick={() => handleRemoveRole(role)}
                className="hover:text-white transition-colors"
              >
                <X size={14} />
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
        <div className="flex items-center glass-dark border border-white/10 rounded-xl focus-within:border-primary/50 focus-within:shadow-glow-primary/10 transition-all duration-300">
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
                : 'Search roles...'
            }
            disabled={value.length >= 3}
            className="flex-1 px-5 py-4 bg-transparent text-white placeholder-slate-700 text-[10px] font-bold uppercase tracking-widest focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <ChevronDown
            size={16}
            className={`mr-4 text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''
              }`}
          />
        </div>

        {/* Dropdown Suggestions */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 glass-dark border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {suggestions.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleSelectRole(role)}
                className="w-full text-left px-5 py-4 hover:bg-primary/10 border-b border-white/5 last:border-b-0 text-slate-400 hover:text-primary transition-all text-[10px] font-bold uppercase tracking-widest"
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {/* No suggestions message */}
        {isOpen && suggestions.length === 0 && inputValue && (
          <div className="absolute top-full left-0 right-0 mt-3 glass-dark border border-white/10 rounded-xl p-5 text-slate-500 text-[10px] font-bold uppercase tracking-widest text-center z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            No matching roles found
          </div>
        )}
      </div>


    </div>
  )
}
