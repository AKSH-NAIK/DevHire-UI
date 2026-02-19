import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Zap, Shield, Users, TrendingUp } from 'lucide-react'
import JobCard from '../components/JobCard'
import { jobsService } from '../services/jobsService'

export default function Landing() {
  const featuredJobs = jobsService.getAllJobs().slice(0, 3)

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-32 md:pb-48">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="text-[10px] font-bold text-primary border border-primary/30 px-4 py-2 uppercase tracking-[0.3em]">
                The Future of Tech Hiring
              </span>
            </div>
            <h1 className="text-7xl md:text-9xl font-bold text-white leading-[0.85] tracking-tighter uppercase">
              Find your
              <br />
              <span className="text-primary">
                dream job
              </span>
            </h1>
          </div>

          <div className="space-y-12">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
              <div className="bg-black p-6 hover:bg-white/[0.02] transition-colors group">
                <div className="text-5xl font-bold text-white mb-3 tracking-tighter group-hover:text-primary transition-colors">2.5K</div>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Active Jobs</p>
              </div>
              <div className="bg-black p-6 hover:bg-white/[0.02] transition-colors group">
                <div className="text-5xl font-bold text-white mb-3 tracking-tighter group-hover:text-primary transition-colors">10K+</div>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Verified Candidates</p>
              </div>
              <div className="bg-black p-6 hover:bg-white/[0.02] transition-colors group">
                <div className="text-5xl font-bold text-white mb-3 tracking-tighter group-hover:text-primary transition-colors">500+</div>
                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Companies</p>
              </div>
              <div className="bg-black p-6 hover:bg-white/[0.02] transition-colors group">
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
                  to="/register"
                  className="px-10 py-5 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-glow-sm"
                >
                  Find Jobs
                </Link>
                <Link
                  to="/register"
                  className="px-10 py-5 border border-white/10 text-white hover:border-primary/50 transition-all text-xs font-bold uppercase tracking-widest"
                >
                  Hire Talent
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[10px] font-bold text-slate-500 text-center mb-24 uppercase tracking-[0.4em]">How It Works</h2>

          <div className="grid md:grid-cols-2 gap-24">
            {/* For Candidates */}
            <div className="space-y-12">
              <h3 className="text-3xl font-bold text-white flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-1.5 h-8 bg-primary"></div>
                For Candidates
              </h3>
              <div className="space-y-8">
                {[
                  'Create your profile and showcase your skills',
                  'Browse through thousands of verified tech jobs',
                  'Apply with a single click and track progress',
                  'Get interviewed and secure your dream role',
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-10 h-10 border border-white/10 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:border-primary group-hover:text-primary transition-colors">
                      0{idx + 1}
                    </div>
                    <p className="text-slate-500 pt-2 uppercase text-[11px] font-bold tracking-wider leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* For Recruiters */}
            <div className="space-y-12">
              <h3 className="text-3xl font-bold text-white flex items-center gap-4 uppercase tracking-tighter">
                <div className="w-1.5 h-8 bg-primary"></div>
                For Recruiters
              </h3>
              <div className="space-y-8">
                {[
                  'Register your company and verify your account',
                  'Post detailed job openings for top talent',
                  'Review applications and manage candidates',
                  'Hire the best developers for your team',
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-10 h-10 border border-white/10 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:border-primary group-hover:text-primary transition-colors">
                      0{idx + 1}
                    </div>
                    <p className="text-slate-500 pt-2 uppercase text-[11px] font-bold tracking-wider leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 border-t border-white/5">
        <div className="flex items-end justify-between mb-20">
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Explore Opportunities</h2>
            <h3 className="text-5xl font-bold text-white uppercase tracking-tighter">Featured Jobs</h3>
          </div>
          <Link to="/jobs" className="text-slate-500 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest pb-2 border-b border-transparent hover:border-primary">
            View all jobs
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-1px bg-white/5 border border-white/5">
          {featuredJobs.map(job => (
            <div key={job.id} className="bg-black">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-[10px] font-bold text-slate-500 text-center mb-24 uppercase tracking-[0.4em]">Why Choose DevHire</h2>

          <div className="grid md:grid-cols-3 gap-px bg-white/5">
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
              <div
                key={idx}
                className="bg-black p-12 hover:bg-white/[0.01] transition-all group border border-transparent hover:border-primary/20"
              >
                <feature.icon className="text-primary mb-8 group-hover:scale-110 transition-transform" size={28} />
                <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">{feature.title}</h3>
                <p className="text-slate-600 text-[11px] font-bold uppercase tracking-wider leading-[1.8]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-48">
        <div className="bg-black border border-white/10 p-24 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
          <h2 className="text-6xl font-bold text-white mb-8 uppercase tracking-tighter">Ready to start?</h2>
          <p className="text-slate-500 mb-16 max-w-xl mx-auto uppercase tracking-widest text-[10px] font-bold">
            Join thousands of developers and companies on DevHire today.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link
              to="/register"
              className="px-12 py-5 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-glow-sm"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-12 py-5 border border-white/10 text-white hover:border-primary transition-all text-xs font-bold uppercase tracking-widest"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
