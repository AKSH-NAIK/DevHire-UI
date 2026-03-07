import React from 'react'
import { Link } from 'react-router-dom'
import {
    Briefcase,
    Users,
    Lightbulb,
    PlusCircle,
    Settings,
    MessageSquare,
    Calendar,
    Layers,
    CheckCircle2,
    ArrowRight
} from 'lucide-react'

export default function RecruiterHelpGuide() {
    const sections = [
        {
            id: 'posting',
            title: 'Posting a Job',
            icon: <PlusCircle className="text-primary w-6 h-6" />,
            description: 'Expand your team by publishing a new job opening easily.',
            details: [
                'Navigate to "Post Jobs" in the dashboard.',
                'Fill in the Job Title, Company Name, and Location.',
                'Specify the Required Skills and a comprehensive Job Description.',
                'Submit the form, and your job becomes instantly visible to candidates.'
            ],
            link: '/post-job',
            linkText: 'Post a Job Now'
        },
        {
            id: 'managing',
            title: 'Managing Your Jobs',
            icon: <Briefcase className="text-primary w-6 h-6" />,
            description: 'Keep your job listings organized and up-to-date.',
            details: [
                'Access all your active listings directly from the Recruiter Dashboard.',
                'View and track the total number of applicants for each job.',
                'Edit job details if requirements or location change.',
                'Remove or close jobs that are no longer available.'
            ],
            link: '/recruiter-dashboard',
            linkText: 'Go to Dashboard'
        },
        {
            id: 'reviewing',
            title: 'Reviewing Applicants',
            icon: <Users className="text-primary w-6 h-6" />,
            description: 'Evaluate candidates and find the perfect match for your roles.',
            details: [
                'Expand the Applicants section on any posted job in the dashboard.',
                'See a comprehensive list of candidates who applied.',
                'Review candidate cover letters, contact information, and resumes.',
                'Update applicant status (e.g., Shortlisted, Rejected) to keep track.'
            ],
            link: '/recruiter-dashboard',
            linkText: 'Review Applicants'
        },
        {
            id: 'tips',
            title: 'Hiring Tips',
            icon: <Lightbulb className="text-primary w-6 h-6" />,
            description: 'Best practices for attracting top talent to your company.',
            details: [
                'Write clear, engaging, and detailed job descriptions.',
                'Explicitly mention required skills, experience level, and tech stack.',
                'Include precise job location and remote/hybrid expectations.',
                'Keep the description concise and structured with bullet points.'
            ]
        },
        {
            id: 'communication',
            title: 'Candidate Communication',
            icon: <MessageSquare className="text-primary w-6 h-6" />,
            description: 'Interact with applicants seamlessly using provided contact details.',
            details: [
                'Find applicant email addresses and phone numbers in your dashboard.',
                'Reach out to shortlisted candidates directly to schedule interviews.',
                'Communicate promptly to ensure a smooth hiring experience.',
                'Maintain candidate status updates to keep your workflow clear.'
            ]
        },
        {
            id: 'settings',
            title: 'Account & Platform',
            icon: <Settings className="text-primary w-6 h-6" />,
            description: 'Manage your recruiter profile and get the most out of the platform.',
            details: [
                'Keep your company information updated during account creation.',
                'Access all features securely by maintaining your login session.',
                'Use the platform regularly to monitor new applications.',
                'Contact support if you encounter any technical difficulties.'
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Recruiter <span className="text-primary">Help Guide</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        Everything you need to know to find, manage, and hire top talent using our job portal.
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
                        <p className="text-slate-400">Our support team is always ready to assist you with any questions.</p>
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
