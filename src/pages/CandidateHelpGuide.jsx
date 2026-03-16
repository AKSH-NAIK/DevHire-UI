import React from 'react'
import { Link } from 'react-router-dom'
import {
    Search,
    Send,
    FileText,
    Bell,
    User,
    CheckCircle2,
    ArrowRight,
    Briefcase,
    Lightbulb,
    MessageSquare
} from 'lucide-react'

export default function CandidateHelpGuide() {
    const sections = [
        {
            id: 'finding-jobs',
            title: 'Finding Your Next Role',
            icon: <Search className="text-primary w-6 h-6" />,
            description: 'Learn how to effectively search and discover jobs that match your skills.',
            details: [
                'Use the search bar to filter jobs by title, company, or keywords.',
                'Refine your search by location (Remote, Hybrid, or On-site).',
                'Explore the "Browse Jobs" section for the latest openings.',
                'Check job requirements and tech stack before applying.'
            ],
            link: '/jobs',
            linkText: 'Browse Jobs'
        },
        {
            id: 'applying',
            title: 'Applying for Jobs',
            icon: <Send className="text-primary w-6 h-6" />,
            description: 'Make a great first impression with your application.',
            details: [
                'Click "Apply Now" on any job that matches your profile.',
                'Review your contact details to ensure recruiters can reach you.',
                'Submit your resume and cover letter (if required).',
                'Join the waitlist if a job is currently filled but still relevant.'
            ],
            link: '/jobs',
            linkText: 'Find a Job'
        },
        {
            id: 'tracking',
            title: 'Tracking Applications',
            icon: <FileText className="text-primary w-6 h-6" />,
            description: 'Keep tabs on all your job applications in one place.',
            details: [
                'Navigate to "My Applications" in your Candidate Dashboard.',
                'Monitor the status of each application (e.g., Applied, Shortlisted).',
                'Review the details of jobs you have already applied for.',
                'Keep track of application dates and company information.'
            ],
            link: '/candidate-dashboard',
            linkText: 'Go to Dashboard'
        },
        {
            id: 'tips',
            title: 'Job Search Tips',
            icon: <Lightbulb className="text-primary w-6 h-6" />,
            description: 'Best practices to stand out to recruiters and land interviews.',
            details: [
                'Keep your resume updated and tailored to technical roles.',
                'Highlight projects that showcase your skills and problem-solving.',
                'Respond promptly to recruiter messages or interview requests.',
                'Research the company before any potential interview.'
            ]
        },
        {
            id: 'communication',
            title: 'Recruiter Interaction',
            icon: <MessageSquare className="text-primary w-6 h-6" />,
            description: 'How to manage communication with potential employers.',
            details: [
                'Ensure your email and phone number are correct in your profile.',
                'Expect potential reach-outs via the contact info you provided.',
                'Maintain professional communication during the hiring process.',
                'Keep your status updated to reflect your current availability.'
            ]
        },
        {
            id: 'account',
            title: 'Managing Your Profile',
            icon: <User className="text-primary w-6 h-6" />,
            description: 'Keeping your personal information and preferences up to date.',
            details: [
                'Update your profile information in the dashboard.',
                'Manage your notification settings to stay alert for new jobs.',
                'Ensure your tech stack and experience levels are accurate.',
                'Contact support if you need help with your account.'
            ],
            link: '/candidate-dashboard',
            linkText: 'Update Profile'
        }
    ]

    return (
        <div className="min-h-screen bg-[#1F1F1F] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Candidate <span className="text-primary">Help Guide</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        Everything you need to know to find your dream job and manage your applications efficiently.
                    </p>
                </div>

                {/* Grid Layout for Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 flex flex-col h-full group"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/10 rounded-xl rounded-tl-sm group-hover:bg-primary/20 transition-colors">
                                    {section.icon}
                                </div>
                                <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                    {section.title}
                                </h2>
                            </div>

                            <p className="text-slate-400 mb-6 text-sm flex-grow">
                                {section.description}
                            </p>

                            <div className="space-y-3 mb-8">
                                {section.details.map((detail, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 opacity-70" />
                                        <p className="text-slate-300 text-sm leading-relaxed">
                                            {detail}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {section.link && (
                                <div className="mt-auto pt-4 border-t border-white/10">
                                    <Link
                                        to={section.link}
                                        className="inline-flex items-center gap-2 text-primary font-medium hover:text-white transition-colors text-sm"
                                    >
                                        {section.linkText} <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Help Area */}
                <div className="mt-16 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 text-center md:text-left md:flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Still need help?</h3>
                        <p className="text-slate-400">Our support team is here to help you navigate your job search.</p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <Link
                            to="/contact"
                            className="px-6 py-3 bg-primary text-black font-bold rounded hover:bg-white transition-colors inline-block"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}
