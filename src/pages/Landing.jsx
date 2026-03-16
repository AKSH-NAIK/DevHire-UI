import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Zap, Shield, Users, TrendingUp } from 'lucide-react'
import JobCard from '../components/JobCard'
import { jobsService } from '../services/jobsService'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const { user } = useAuth()
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsService.getAllJobs()
        const allJobs = Array.isArray(response) ? response : response?.jobs || []
        setFeaturedJobs(allJobs.slice(0, 3))
      } catch (error) {
        console.error("Failed to fetch featured jobs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } },
    viewport: { once: true }
  }

  return (
    <div className="min-h-screen mesh-gradient overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-32 md:pb-48">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-block">
              <span className="text-[10px] font-bold text-primary border border-primary/30 px-4 py-2 uppercase tracking-[0.3em] rounded-full glass">
                The Future of Tech Hiring
              </span>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold text-white leading-[0.85] tracking-tighter uppercase">
              Find your
              <br />
              <motion.span
                animate={{ color: ['#F59E0B', '#FBBF24', '#F59E0B'] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-primary text-glow"
              >
                dream job
              </motion.span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 glass rounded-2xl overflow-hidden">
              <div className="p-6 hover:bg-white/[0.02] transition-colors group">
                <div className="text-5xl font-bold text-white mb-3 tracking-tighter group-hover:text-primary transition-colors">2.5K</div>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Active Jobs</p>
              </div>
              <div className="p-6 hover:bg-white/[0.02] transition-colors group border-l border-white/5">
                <div className="text-5xl font-bold text-white mb-3 tracking-tighter group-hover:text-primary transition-colors">10K+</div>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Verified Candidates</p>
              </div>
              <div className="p-6 hover:bg-white/[0.02] transition-colors group border-t border-white/5">
                <div className="text-5xl font-bold text-white mb-3 tracking-tighter group-hover:text-primary transition-colors">500+</div>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Companies</p>
              </div>
              <div className="p-6 hover:bg-white/[0.02] transition-colors group border-t border-l border-white/5">
                <div className="text-5xl font-bold text-white mb-3 tracking-tighter group-hover:text-primary transition-colors">92%</div>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Fill Rate</p>
              </div>
            </div>

            <div className="space-y-8">
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl uppercase tracking-tight font-medium">
                DevHire connects the world's best developers with the most innovative companies.
                Secure your next role or build your dream team with our advanced matching platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to={user ? "/jobs" : "/register"}
                  className="px-10 py-5 bg-primary text-black hover:bg-primary/90 transition-all text-xs font-bold uppercase tracking-widest shadow-glow-primary rounded-lg text-center"
                >
                  Find Jobs
                </Link>
                <Link
                  to={user ? (user.role === 'recruiter' ? "/recruiter-dashboard" : "/candidate-dashboard") : "/register"}
                  className="px-10 py-5 border border-white/10 text-white hover:border-primary/50 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest rounded-lg text-center"
                >
                  {user ? "Dashboard" : "Hire Talent"}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <motion.section
        {...fadeInUp}
        className="py-32 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[10px] font-bold text-slate-500 text-center mb-24 uppercase tracking-[0.4em]">How It Works</h2>

          <div className="grid md:grid-cols-2 gap-24">
            {/* For Candidates */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h3 className="text-3xl font-bold text-white flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-1.5 h-8 bg-primary shadow-glow-primary"></div>
                For Candidates
              </h3>
              <div className="space-y-8">
                {[
                  'Create your profile and showcase your skills',
                  'Browse through thousands of verified tech jobs',
                  'Apply with a single click and track progress',
                  'Get interviewed and secure your dream role',
                ].map((step, idx) => (
                  <motion.div variants={fadeInUp} key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-10 h-10 border border-white/10 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all rounded-lg">
                      0{idx + 1}
                    </div>
                    <p className="text-slate-500 pt-2 uppercase text-[11px] font-bold tracking-wider leading-relaxed">{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* For Recruiters */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="space-y-12"
            >
              <h3 className="text-3xl font-bold text-white flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-1.5 h-8 bg-primary shadow-glow-primary"></div>
                For Recruiters
              </h3>
              <div className="space-y-8">
                {[
                  'Register your company and verify your account',
                  'Post detailed job openings for top talent',
                  'Review applications and manage candidates',
                  'Hire the best candidates for your company',
                ].map((step, idx) => (
                  <motion.div variants={fadeInUp} key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-10 h-10 border border-white/10 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all rounded-lg">
                      0{idx + 1}
                    </div>
                    <p className="text-slate-500 pt-2 uppercase text-[11px] font-bold tracking-wider leading-relaxed">{step}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Jobs */}
      <motion.section
        {...fadeInUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-t border-white/5"
      >
        <div className="flex items-end justify-between mb-20">
          <div className="space-y-4">
            <h1 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Explore Opportunities</h1>
            <h2 className="text-5xl font-bold text-white uppercase tracking-tighter">Featured Jobs</h2>
          </div>
          <Link to="/jobs" className="text-slate-500 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest pb-2 border-b border-transparent hover:border-primary">
            View all jobs
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredJobs.map(job => (
            <motion.div
              key={job.id}
              whileHover={{ y: -10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <JobCard job={job} userRole={user?.role} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        {...fadeInUp}
        className="py-32 bg-white/[0.02] border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[10px] font-bold text-slate-500 text-center mb-24 uppercase tracking-[0.4em]">Why Choose DevHire</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Verified Employers',
                description: 'We manually verify every company to ensure a safe job search experience.',
              },
              {
                icon: Zap,
                title: 'Fast & Efficient',
                description: 'Our streamlined platform makes applying and hiring faster than ever.',
              },
              {
                icon: TrendingUp,
                title: 'Smart Matching',
                description: 'Advanced algorithms connect you with roles that truly match your skills.',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 backdrop-blur-sm p-12 hover:bg-white/[0.01] transition-all group border border-white/5 hover:border-primary/20 rounded-2xl"
              >
                <feature.icon className="text-primary mb-8 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-slate-600 text-[11px] font-bold uppercase tracking-wider leading-[1.8]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        {...fadeInUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-48"
      >
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-12 md:p-24 text-center relative overflow-hidden group rounded-3xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
          <h2 className="text-6xl font-bold text-white mb-8 uppercase tracking-tighter">Ready to start?</h2>
          <p className="text-slate-500 mb-16 max-w-xl mx-auto uppercase tracking-widest text-[10px] font-bold">
            Join thousands of developers and companies on DevHire today.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center relative z-10">
            {user ? (
              <Link
                to={user.role === 'recruiter' ? "/recruiter-dashboard" : "/candidate-dashboard"}
                className="px-12 py-5 bg-primary text-black hover:bg-primary/90 transition-all text-xs font-bold uppercase tracking-widest shadow-glow-primary rounded-lg text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-12 py-5 bg-primary text-black hover:bg-primary/90 transition-all text-xs font-bold uppercase tracking-widest shadow-glow-primary rounded-lg text-center"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="px-12 py-5 border border-white/10 text-white hover:border-primary hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest rounded-lg text-center"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
