'use client';

import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Globe, Search, ShieldCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { jobsService } from '../services/jobsService'

const sampleFeaturedJob = {
  title: 'MERN Stack Developer',
  company: 'Tech Solutions Pvt. Ltd.',
  location: 'Mumbai,India',
  description: 'We are seeking a skilled MERN Stack Developer to join our team. ',
  salary: '₹45,000 - ₹50,000 / mo',
  skills: ['MongoDB', 'Express.js', 'React', 'Node.js'],
  type: 'Full-Time',
  postedAt: '29 JUL 2026',
}

const LANDING_JOBS_CACHE_KEY = 'landing_preview_jobs_v1'
const LANDING_JOBS_CACHE_TTL_MS = 5 * 60 * 1000
const LANDING_FALLBACK_DELAY_MS = 1200

const formatSalaryRange = (job) => {
  const salaryMin = Number(job?.salaryMin)
  const salaryMax = Number(job?.salaryMax)

  if (Number.isFinite(salaryMin) && Number.isFinite(salaryMax)) {
    return `₹${salaryMin.toLocaleString('en-IN')} - ₹${salaryMax.toLocaleString('en-IN')} ${job?.salaryPeriod === 'Yearly' ? '/ yr' : '/ mo'}`
  }

  return job?.salary || 'Salary not disclosed'
}

const formatJobDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true

    const readCachedJobs = () => {
      try {
        const raw = sessionStorage.getItem(LANDING_JOBS_CACHE_KEY)
        if (!raw) return null

        const parsed = JSON.parse(raw)
        const isFresh = Date.now() - Number(parsed?.updatedAt || 0) < LANDING_JOBS_CACHE_TTL_MS
        const cachedJobs = Array.isArray(parsed?.jobs) ? parsed.jobs : []

        if (isFresh && cachedJobs.length > 0) {
          return cachedJobs
        }
      } catch (error) {
        console.warn('Failed to read landing jobs cache:', error)
      }

      return null
    }

    const writeCachedJobs = (nextJobs) => {
      try {
        sessionStorage.setItem(
          LANDING_JOBS_CACHE_KEY,
          JSON.stringify({
            jobs: nextJobs,
            updatedAt: Date.now(),
          })
        )
      } catch (error) {
        console.warn('Failed to write landing jobs cache:', error)
      }
    }

    const cachedJobs = readCachedJobs()
    if (cachedJobs && active) {
      setJobs(cachedJobs)
      setLoading(false)
    }

    // Keep first paint responsive even when backend is waking up.
    const fallbackTimer = window.setTimeout(() => {
      if (active) {
        setLoading(false)
      }
    }, LANDING_FALLBACK_DELAY_MS)

    const fetchJobs = async () => {
      try {
        const response = await jobsService.getAllJobs({
          limit: 3,
          sortBy: 'createdAt',
          order: 'desc',
        })
        const allJobs = Array.isArray(response) ? response : response?.jobs || []

        if (active) {
          setJobs(allJobs)
          writeCachedJobs(allJobs)
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
        if (active && !cachedJobs) {
          setJobs([])
        }
      } finally {
        window.clearTimeout(fallbackTimer)
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchJobs()

    return () => {
      active = false
      window.clearTimeout(fallbackTimer)
    }
  }, [])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((left, right) => {
      const leftTime = new Date(left?.createdAt || 0).getTime()
      const rightTime = new Date(right?.createdAt || 0).getTime()
      return rightTime - leftTime
    })
  }, [jobs])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100">
      <section className="relative overflow-hidden border-b border-zinc-800/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(39,39,42,0.85),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-5 sm:px-6 lg:px-8 lg:pb-24 lg:pt-8">
          <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 lg:space-y-5"
            >
              <h1 className="max-w-4xl text-4xl font-bold leading-[0.94] tracking-[-0.058em] text-zinc-100 sm:text-5xl md:text-6xl lg:text-8xl">
                Where Developers and Great Teams
                <br />
                <span className="text-amber-400">Connect Directly.</span>
              </h1>

              <p className="max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base md:text-lg">
                Browse live roles with upfront salary ranges and zero middleman clutter.
              </p>

              <form
                onSubmit={handleSearchSubmit}
                className="max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/70 p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-3"
              >
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                  <label className="sr-only" htmlFor="quick-job-search">
                    Search active jobs
                  </label>
                  <div className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2.5 transition-colors focus-within:border-amber-500/40 sm:px-4 sm:py-3">
                    <Search className="shrink-0 text-zinc-500" size={18} />
                    <input
                      id="quick-job-search"
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by skill, title, or company"
                      className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_10px_30px_rgba(245,158,11,0.25)] sm:w-auto sm:px-5"
                  >
                    Search jobs
                  </button>
                </div>
              </form>

              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  to={user ? '/jobs' : '/register'}
                  className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-3.5 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_10px_30px_rgba(245,158,11,0.25)] sm:px-6 sm:py-4"
                >
                  Explore live jobs
                </Link>
                <Link
                  to={user ? (user.role === 'recruiter' ? '/post-job' : '/candidate-dashboard') : '/register'}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3.5 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-800 sm:px-6 sm:py-4"
                >
                  {user ? 'Open dashboard' : 'Join DevHire'}
                </Link>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-3 sm:gap-3 lg:gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: 'Verified Tech Roles',
                    text: 'Zero ghost jobs or middleman recruitment agencies',
                  },
                  {
                    icon: Zap,
                    title: 'Fast Feedback',
                    text: 'Direct candidate-to-recruiter pipeline',
                  },
                  {
                    icon: Globe,
                    title: 'Flexible Working',
                    text: 'Remote & India-based hybrid roles',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all hover:border-amber-500/30 sm:p-4"
                  >
                    <div className="inline-flex rounded-lg bg-amber-500/10 p-2 text-amber-500">
                      <item.icon size={16} className="sm:h-[18px] sm:w-[18px]" />
                    </div>
                    <h3 className="mt-3 text-[0.72rem] font-semibold text-white sm:text-sm">{item.title}</h3>
                    <p className="mt-1 text-[0.65rem] leading-4 text-zinc-400 sm:text-xs sm:leading-5">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center gap-3 self-start lg:pt-36"
            >
              {sortedJobs.slice(0, 3).length > 0 ? (
                sortedJobs.slice(0, 3).map((job) => (
                  <div
                    key={job._id || job.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 transition-all duration-300 hover:border-amber-500/40 hover:bg-zinc-900"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-semibold text-zinc-100">{job?.title || 'Untitled role'}</h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {job?.company || 'Company not listed'} • {job?.location || 'Location not listed'}
                        </p>
                      </div>
                      <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-300">
                        {job?.type || 'Full-Time'}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4 text-sm text-zinc-400">
                      <span>{formatSalaryRange(job)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="relative w-full overflow-hidden rounded-[22px] border border-[#5e4306] bg-[#1a1a1a] px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] lg:-mt-1 xl:-mt-2">
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[18px] font-semibold leading-tight tracking-[-0.03em] text-[#f4f4f5]">
                          {sampleFeaturedJob.title}
                        </h3>
                        <p className="mt-1 text-[13px] leading-snug text-[#9ca3af]">
                          {sampleFeaturedJob.company} • {sampleFeaturedJob.location}
                        </p>
                      </div>

                      <span className="flex-shrink-0 rounded-full border border-[#4a4a4a] bg-[#171717] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e5e7eb]">
                        {sampleFeaturedJob.type}
                      </span>
                    </div>

                    <p className="mt-5 max-w-[90%] text-[14px] font-medium uppercase tracking-[-0.01em] text-[#9ca3af] sm:max-w-[80%]">
                      {sampleFeaturedJob.description}
                    </p>

                    <div className="mt-5 border-t border-[#2a2a2a] pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[16px] font-semibold tracking-[-0.03em] text-[#f7c948] sm:text-[18px]">
                            {sampleFeaturedJob.salary.split(' / ')[0]} / {sampleFeaturedJob.salary.split(' / ')[1]}
                          </p>
                        </div>

                        <p className="max-w-[155px] text-right text-[10px] font-semibold uppercase tracking-[0.35em] text-[#7f8792] sm:max-w-none sm:text-[11px]">
                          Posted {sampleFeaturedJob.postedAt}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {sampleFeaturedJob.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-[#222] bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#f4f4f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                    </div>
                  </div>

                  <div className="flex w-full justify-center pt-2">
                    <Link
                      to="/jobs"
                      className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#e5e7eb] transition-colors hover:text-amber-400"
                    >
                      Open jobs
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section {...fadeInUp} className="border-b border-zinc-800/70 bg-zinc-900/30 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-amber-300">Why DevHire</p>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-zinc-100 md:text-5xl">
              A focused workflow for candidates and recruiters
            </h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 py-12 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-100">For Candidates</h3>
                <p className="text-sm leading-7 text-zinc-400">A transparent path to your next tech role.</p>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  {
                    step: '1',
                    title: 'Discover Live Roles',
                    description: 'Search active openings with salary ranges disclosed upfront in INR.',
                  },
                  {
                    step: '2',
                    title: 'Apply Directly',
                    description: 'Send your application straight to the company\'s internal dashboard.',
                  },
                  {
                    step: '3',
                    title: 'Track & Connect',
                    description: 'Track application status in real-time without middleman recruiters.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 rounded-xl border border-white/5 bg-zinc-950/40 p-4">
                    <span className="mt-0.5 inline-flex h-fit items-center rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1 font-mono text-xs font-bold text-amber-400">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100">{item.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-100">For Recruiters</h3>
                <p className="text-sm leading-7 text-zinc-400">Streamlined tech hiring without ATS clutter.</p>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  {
                    step: '1',
                    title: 'Post Openings',
                    description: 'Create rich job listings with transparent pay bands and skill requirements.',
                  },
                  {
                    step: '2',
                    title: 'Review Applicants',
                    description: 'Access candidate profiles directly from your unified recruiter dashboard.',
                  },
                  {
                    step: '3',
                    title: 'Hire Efficiently',
                    description: 'Manage candidate pipeline stages with fast response times.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 rounded-xl border border-white/5 bg-zinc-950/40 p-4">
                    <span className="mt-0.5 inline-flex h-fit items-center rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1 font-mono text-xs font-bold text-amber-400">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100">{item.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeInUp} className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-amber-300">Live listings</p>
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-zinc-100 md:text-5xl">Every current opening</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-500 md:text-right">
            Browse the latest roles with salary, type, and location details shown clearly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="h-4 w-24 rounded-full bg-zinc-800" />
                <div className="mt-4 h-7 w-3/4 rounded-full bg-zinc-800" />
                <div className="mt-6 h-20 rounded-2xl bg-zinc-950/70" />
                <div className="mt-6 h-4 w-40 rounded-full bg-zinc-800" />
              </div>
            ))
          ) : sortedJobs.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
                <h3 className="text-2xl font-semibold tracking-[-0.03em] text-zinc-100">No active job listings yet.</h3>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
                  Be the first recruiter to post a role on DevHire.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    to="/post-job"
                    className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-6 py-4 text-sm font-semibold text-zinc-950 transition-all duration-300 hover:bg-amber-400"
                  >
                    + Post a Job
                  </Link>
                  <Link
                    to={user ? (user.role === 'recruiter' ? '/post-job' : '/jobs') : '/register'}
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-4 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-800"
                  >
                    {user ? 'Explore dashboard' : 'Create account'}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            sortedJobs.map((job) => {
              const salaryLabel = formatSalaryRange(job)
              const postedDate = formatJobDate(job?.createdAt)

              return (
                <motion.article
                  key={job._id || job.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35 }}
                  className="group relative h-full rounded-3xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-amber-500/40 hover:bg-zinc-900"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold tracking-[-0.03em] text-zinc-100 transition-colors group-hover:text-amber-300">
                          {job?.title || 'Untitled role'}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-400">
                          {job?.company || 'Company not listed'} • {job?.location || 'Location not listed'}
                        </p>
                      </div>
                      <span className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-300">
                        {job?.type || 'Full-Time'}
                      </span>
                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-7 text-zinc-400">
                      {job?.description || 'No description provided.'}
                    </p>

                    <div className="mt-6 flex items-center justify-between gap-4 border-t border-zinc-800 pt-5">
                      <span className="text-lg font-semibold tracking-[-0.02em] text-amber-300">
                        {salaryLabel}
                      </span>
                      {postedDate ? (
                        <span className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
                          Posted {postedDate}
                        </span>
                      ) : null}
                    </div>

                    {Array.isArray(job?.requirements) && job.requirements.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.requirements.slice(0, 3).map((requirement) => (
                          <span
                            key={requirement}
                            className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-300"
                          >
                            {requirement}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-end">
                      <Link
                        to="/jobs"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-300 transition-colors hover:text-zinc-100"
                      >
                        Open jobs
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              )
            })
          )}
        </div>
      </motion.section>
    </div>
  )
}
