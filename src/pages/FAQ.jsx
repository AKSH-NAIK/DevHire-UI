import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0)

    const faqs = [
        {
            question: 'What is DevHire?',
            answer:
                'DevHire is a modern job platform that connects talented developers with innovative companies. We streamline the hiring process by providing a seamless experience for both job seekers and recruiters, making it easier to find the perfect match.',
        },
        {
            question: 'How do I create an account?',
            answer:
                'Click on the "Get Started" or "Register" button at the top of the page. You\'ll need to choose whether you\'re a job seeker (candidate) or a recruiter, then fill in your basic information including name, email, and password. After registration, you can complete your profile with additional details.',
        },
        {
            question: 'Is DevHire free to use?',
            answer:
                'Yes! DevHire is completely free for job seekers. You can browse jobs, create your profile, and apply to unlimited positions at no cost. Recruiters can post jobs and access our talent pool with various pricing options.',
        },
        {
            question: 'How do I apply for a job?',
            answer:
                'Browse our job listings on the Jobs page, find a position that interests you, and click on it to view full details. If you\'re logged in as a candidate, you\'ll see an "Apply Now" button. Click it to submit your application along with your profile information.',
        },
        {
            question: 'How can recruiters post jobs?',
            answer:
                'Recruiters need to register for a recruiter account first. Once logged in, navigate to your dashboard where you\'ll find a "Post New Job" button. Fill in the job details including title, description, requirements, salary range, and location. Your job will be live immediately after posting.',
        },
        {
            question: 'What makes DevHire different from other job platforms?',
            answer:
                'DevHire focuses exclusively on tech talent, providing a curated experience for developers and tech companies. We offer smart matching algorithms, verified employers, a modern user interface, and tools specifically designed for the tech hiring process.',
        },
        {
            question: 'Can I edit my profile after creating it?',
            answer:
                'Absolutely! You can update your profile information at any time from your dashboard. This includes your personal details, skills, experience, resume, and preferences. Keeping your profile up-to-date helps you get better job matches.',
        },
        {
            question: 'How do I track my job applications?',
            answer:
                'Once you\'re logged in as a candidate, go to your dashboard to see all your active applications. You can track the status of each application, view which jobs you\'ve applied to, and manage your job search in one place.',
        },
        {
            question: 'Are the job listings verified?',
            answer:
                'Yes! We verify all companies posting on DevHire to ensure they are legitimate employers. This protects job seekers from fraudulent postings and ensures a trustworthy platform for everyone.',
        },
        {
            question: 'What if I need help or support?',
            answer:
                'If you need assistance, you can contact us through our Contact Us page. We\'re here to help with any questions about using the platform, account issues, or general inquiries. We typically respond within 24-48 hours.',
        },
    ]

    return (
        <div className="min-h-screen bg-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                {/* Header */}
                <div className="text-left mb-24">
                    <div className="inline-flex items-center justify-center w-12 h-12 border border-primary mb-8">
                        <HelpCircle className="text-primary" size={24} />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 uppercase tracking-tighter">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em]">
                        Everything you need to know about DevHire
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-px bg-white/5 border border-white/5">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-black overflow-hidden group border-b border-white/5 last:border-0"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                            >
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest leading-relaxed pr-8">
                                    <span className="text-primary mr-4">[{String(idx + 1).padStart(2, '0')}]</span>
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    className={`text-slate-600 transition-transform duration-300 group-hover:text-primary ${openIndex === idx ? 'rotate-180 text-primary' : ''
                                        }`}
                                    size={16}
                                />
                            </button>
                            <div
                                className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-8 pb-8 pt-2 text-base text-slate-500 leading-relaxed uppercase font-medium tracking-tight border-t border-white/5 mx-8">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-24 border border-white/10 p-16 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
                    <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">
                        Still have questions?
                    </h2>
                    <p className="text-slate-500 mb-10 text-[10px] uppercase font-bold tracking-widest">
                        Can't find the answer you're looking for? Please chat to our friendly team.
                    </p>
                    <a
                        href="/contact"
                        className="inline-block px-12 py-4 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-glow-sm"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    )
}
