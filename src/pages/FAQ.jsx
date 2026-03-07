import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

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
        <div className="min-h-screen mesh-gradient">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-left mb-24"
                >
                    <div className="inline-flex items-center justify-center w-14 h-14 border border-primary/30 mb-8 rounded-2xl bg-primary/5 shadow-glow-primary/5">
                        <HelpCircle className="text-primary" size={24} />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 uppercase tracking-tighter text-glow">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.4em]">
                        Everything you need to know about DevHire
                    </p>
                </motion.div>
                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-dark overflow-hidden group border border-white/10 rounded-2xl"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                className="w-full px-8 py-7 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                            >
                                <h3 className="text-lg font-bold text-white uppercase tracking-widest leading-relaxed pr-8">
                                    <span className="text-primary/60 mr-4 font-mono">[{String(idx + 1).padStart(2, '0')}]</span>
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    className={`text-slate-600 transition-transform duration-500 group-hover:text-primary ${openIndex === idx ? 'rotate-180 text-primary' : ''
                                        }`}
                                    size={16}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-8 pb-8 pt-2 text-base text-slate-500 leading-relaxed uppercase font-medium tracking-tight border-t border-white/5 mx-8 mt-2">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 glass-dark border border-white/10 p-16 rounded-[2rem] text-center relative overflow-hidden group shadow-glow-primary/5"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>

                    <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter text-glow">
                        Still have questions?
                    </h2>
                    <p className="text-slate-500 mb-10 text-[10px] uppercase font-bold tracking-[0.2em] max-w-md mx-auto">
                        Can't find the answer you're looking for? Please chat to our friendly team.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-block px-12 py-4 border border-primary text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold uppercase tracking-widest shadow-glow-primary rounded-xl"
                    >
                        Contact Us
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}
