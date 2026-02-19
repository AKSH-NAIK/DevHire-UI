import { FileText } from 'lucide-react'

export default function TermsOfService() {
    const lastUpdated = 'February 12, 2026'

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: (
                <p>
                    By accessing and using DevHire, you accept and agree to be bound by the terms and
                    provisions of this agreement. If you do not agree to these terms, please do not use
                    our platform.
                </p>
            ),
        },
        {
            title: '2. User Accounts',
            content: (
                <>
                    <p className="mb-3">When you create an account with us, you agree to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Provide accurate and complete information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Notify us immediately of any unauthorized access</li>
                        <li>Be responsible for all activities under your account</li>
                    </ul>
                </>
            ),
        },
        {
            title: '3. Acceptable Use',
            content: (
                <>
                    <p className="mb-3">You agree not to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Post false or misleading information</li>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Harass, abuse, or harm other users</li>
                        <li>Attempt to gain unauthorized access to our systems</li>
                        <li>Use automated systems to scrape or collect data</li>
                    </ul>
                </>
            ),
        },
        {
            title: '4. User Content',
            content: (
                <p>
                    You retain ownership of any content you post on DevHire (resumes, job postings, etc.).
                    By posting content, you grant us a license to use, display, and distribute it as
                    necessary to provide our services. You are responsible for ensuring your content does
                    not violate any third-party rights.
                </p>
            ),
        },
        {
            title: '5. Intellectual Property',
            content: (
                <p>
                    The DevHire platform, including all content, features, and functionality, is owned by
                    DevHire and is protected by intellectual property laws. You may not copy, modify,
                    distribute, or reverse engineer any part of our platform without permission.
                </p>
            ),
        },
        {
            title: '6. Job Postings and Applications',
            content: (
                <>
                    <p className="mb-3">For recruiters:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
                        <li>Job postings must be legitimate employment opportunities</li>
                        <li>You must comply with all employment laws and regulations</li>
                    </ul>
                    <p className="mb-3">For candidates:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Your profile information must be accurate and truthful</li>
                        <li>You are responsible for communicating directly with recruiters</li>
                    </ul>
                </>
            ),
        },
        {
            title: '7. Disclaimer of Warranties',
            content: (
                <p>
                    DevHire is provided "as is" without any warranties, express or implied. We do not
                    guarantee that the platform will be error-free, secure, or always available. We are
                    not responsible for the accuracy of user-generated content or the outcome of any
                    employment relationships.
                </p>
            ),
        },
        {
            title: '8. Limitation of Liability',
            content: (
                <p>
                    To the maximum extent permitted by law, DevHire shall not be liable for any indirect,
                    incidental, special, or consequential damages arising from your use of the platform.
                    This includes, but is not limited to, lost profits, data loss, or business interruption.
                </p>
            ),
        },
        {
            title: '9. Termination',
            content: (
                <p>
                    We reserve the right to suspend or terminate your account at any time for violations
                    of these terms or for any other reason. You may also delete your account at any time
                    through your account settings.
                </p>
            ),
        },
        {
            title: '10. Changes to Terms',
            content: (
                <p>
                    We may modify these terms at any time. We will notify users of significant changes
                    by posting the updated terms on this page. Your continued use of DevHire after changes
                    constitutes acceptance of the new terms.
                </p>
            ),
        },
        {
            title: '11. Contact Information',
            content: (
                <p>
                    If you have questions about these Terms of Service, please contact us at{' '}
                    <a href="mailto:legal@devhire.com" className="text-cyan-400 hover:text-cyan-300">
                        legal@devhire.com
                    </a>
                </p>
            ),
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-[#0a0e27]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-full border border-cyan-500/20 mb-6">
                        <FileText className="text-cyan-400" size={32} />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">Terms of Service</h1>
                    <p className="text-slate-400">Last updated: {lastUpdated}</p>
                </div>

                {/* Introduction */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 mb-8">
                    <p className="text-slate-300 leading-relaxed">
                        Welcome to DevHire. These Terms of Service govern your use of our platform and
                        services. Please read them carefully. By using DevHire, you agree to comply with
                        and be bound by these terms.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <div
                            key={idx}
                            className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 hover:border-cyan-500/40 transition-all duration-300"
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">{section.title}</h2>
                            <div className="text-slate-300 leading-relaxed">{section.content}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
