const JOBS_KEY = 'devhire_jobs'
const APPLICATIONS_KEY = 'devhire_applications'
const REPORTS_KEY = 'devhire_reports'

// Demo jobs data
const demoJobs = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp',
    companyId: '1',
    location: 'San Francisco, CA',
    salary: '$120,000 - $160,000',
    description: 'Looking for an experienced React developer to lead our frontend team.',
    requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
    type: 'Full-time',
    status: 'active',
    verified: true,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 12,
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    companyId: '2',
    location: 'Remote',
    salary: '$80,000 - $120,000',
    description: 'Join our fast-growing startup as a Full Stack Developer.',
    requirements: ['Node.js', 'React', 'MongoDB', '3+ years experience'],
    type: 'Full-time',
    status: 'active',
    verified: false,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 8,
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'CloudTech',
    companyId: '3',
    location: 'New York, NY',
    salary: '$110,000 - $150,000',
    description: 'Build scalable backend systems for our cloud platform.',
    requirements: ['Node.js', 'PostgreSQL', 'AWS', '4+ years experience'],
    type: 'Full-time',
    status: 'active',
    verified: true,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applicants: 15,
  },
]

const initializeDemoJobs = () => {
  const existing = localStorage.getItem(JOBS_KEY)
  if (!existing) {
    localStorage.setItem(JOBS_KEY, JSON.stringify(demoJobs))
  }
}

export const jobsService = {
  getAllJobs: (filters = {}) => {
    initializeDemoJobs()
    let jobs = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]')

    if (filters.status) {
      jobs = jobs.filter(j => j.status === filters.status)
    }
    if (filters.companyId) {
      jobs = jobs.filter(j => j.companyId === filters.companyId)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(search) ||
        j.company.toLowerCase().includes(search)
      )
    }

    return jobs.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
  },

  getJobById: (id) => {
    initializeDemoJobs()
    const jobs = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]')
    return jobs.find(j => j.id === id)
  },

  createJob: (jobData) => {
    initializeDemoJobs()
    const jobs = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]')

    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      status: 'pending',
      verified: false,
      postedAt: new Date().toISOString(),
      applicants: 0,
    }

    jobs.push(newJob)
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))

    return newJob
  },

  updateJob: (jobId, updates) => {
    initializeDemoJobs()
    const jobs = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]')
    const index = jobs.findIndex(j => j.id === jobId)

    if (index === -1) throw new Error('Job not found')

    jobs[index] = { ...jobs[index], ...updates }
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))

    return jobs[index]
  },

  deleteJob: (jobId) => {
    initializeDemoJobs()
    const jobs = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]')
    const filtered = jobs.filter(j => j.id !== jobId)
    localStorage.setItem(JOBS_KEY, JSON.stringify(filtered))
  },

  // ── Applications ────────────────────────────────────────────────────────────

  applyToJob: (jobId, candidateId, metadata = {}) => {
    const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]')

    if (applications.find(a => a.jobId === jobId && a.candidateId === candidateId)) {
      throw new Error('Already applied to this job')
    }

    const application = {
      id: Date.now().toString(),
      jobId,
      candidateId,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      // Full metadata for recruiter review panel
      applicantName: metadata.applicantName || '',
      applicantEmail: metadata.applicantEmail || '',
      phone: metadata.phone || '',
      coverLetter: metadata.coverLetter || '',
      resumeName: metadata.resumeName || '',
    }

    applications.push(application)
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications))

    // Increment applicant count on the job
    const jobs = JSON.parse(localStorage.getItem(JOBS_KEY) || '[]')
    const jobIndex = jobs.findIndex(j => j.id === jobId)
    if (jobIndex !== -1) {
      jobs[jobIndex].applicants = (jobs[jobIndex].applicants || 0) + 1
      localStorage.setItem(JOBS_KEY, JSON.stringify(jobs))
    }

    return application
  },

  updateApplicationStatus: (applicationId, status) => {
    const valid = ['applied', 'reviewed', 'accepted', 'rejected']
    if (!valid.includes(status)) throw new Error('Invalid status')

    const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]')
    const index = applications.findIndex(a => a.id === applicationId)
    if (index === -1) throw new Error('Application not found')

    applications[index] = {
      ...applications[index],
      status,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications))
    return applications[index]
  },

  getApplications: (filters = {}) => {
    const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]')

    let filtered = applications
    if (filters.candidateId) {
      filtered = filtered.filter(a => a.candidateId === filters.candidateId)
    }
    if (filters.jobId) {
      filtered = filtered.filter(a => a.jobId === filters.jobId)
    }

    return filtered.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
  },

  hasApplied: (jobId, candidateId) => {
    const applications = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]')
    return applications.some(a => a.jobId === jobId && a.candidateId === candidateId)
  },

  // ── Reports ─────────────────────────────────────────────────────────────────

  /**
   * submitReport — stores a report WITHOUT affecting the job listing or recruiter.
   * Job stays visible. Recruiter is NOT blocked. Admin reviews reports separately.
   */
  submitReport: (reportData) => {
    const reports = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]')
    const report = {
      id: Date.now().toString(),
      ...reportData,
    }
    reports.push(report)
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
    return report
  },

  getReports: () => {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]')
  },
}
