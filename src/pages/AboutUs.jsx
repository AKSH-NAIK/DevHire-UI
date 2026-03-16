import { Link } from 'react-router-dom'
import { ArrowRight, Target, Heart, Zap, Users } from 'lucide-react'

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-[#1F1F1F]">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
                <div className="text-left space-y-8">
                    <div className="inline-block">
                        <span className="text-[10px] font-bold text-primary border border-primary/30 px-4 py-2 uppercase tracking-widest">
                            Our Story
                        </span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold text-white leading-[0.9] tracking-tighter uppercase">
                        Empowering
                        <br />
                        <span className="text-primary">Tech Talent</span>
                    </h1>
                    <p className="text-lg text-slate-500 leading-relaxed max-w-2xl uppercase tracking-tight font-medium">
                        DevHire is a premier job board dedicated to the technology industry.
                        We help developers find meaningful work and companies build great engineering teams.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="bg-[#1F1F1F] border border-white/10 p-10 hover:border-primary/40 transition-all group">
                        <Target className="text-primary mb-6 transition-transform group-hover:scale-110" size={32} />
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Our Mission</h2>
                        <p className="text-slate-500 leading-relaxed font-medium">
                            To create a transparent and efficient hiring process for the global tech community.
                            We believe in the power of code and the people who write it.
                        </p>
                    </div>
                    <div className="bg-[#1F1F1F] border border-white/10 p-10 hover:border-primary/40 transition-all group">
                        <Heart className="text-primary mb-6 transition-transform group-hover:scale-110" size={32} />
                        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Our Vision</h2>
                        <p className="text-slate-500 leading-relaxed font-medium">
                            To be the most trusted resource for tech professionals as they navigate their
                            careers and for companies as they scale their technology organizations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="border border-white/10 p-16 bg-white/[0.02]">
                    <h2 className="text-[10px] font-bold text-slate-500 text-center mb-16 uppercase tracking-[0.3em]">DevHire Stats</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { value: '2.5K', label: 'Active Jobs' },
                            { value: '10K+', label: 'Verified Developers' },
                            { value: '500+', label: 'Happy Companies' },
                            { value: '92%', label: 'Success Rate' },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center group">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tighter group-hover:text-primary transition-colors">{stat.value}</div>
                                <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="bg-[#1F1F1F] border border-white/10 p-20 text-center relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[100px] pointer-events-none"></div>
                    <h2 className="text-5xl font-bold text-white mb-6 uppercase tracking-tight">Ready to join?</h2>
                    <p className="text-slate-500 mb-12 max-w-xl mx-auto uppercase tracking-widest text-[10px] font-bold">
                        Whether you are looking for your next challenge or building your dream team,
                        DevHire is here to help you succeed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            to="/register"
                            className="px-10 py-4 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-glow-sm"
                        >
                            Sign Up Now
                        </Link>
                        <Link
                            to="/jobs"
                            className="px-10 py-4 border border-white/10 text-white hover:border-primary/50 transition-all text-xs font-bold uppercase tracking-widest"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
