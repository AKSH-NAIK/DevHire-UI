import { Shield } from 'lucide-react'

export default function PrivacyPolicy() {
    const lastUpdated = 'February 12, 2026'

    const sections = [
        {
            title: '1. Information We Collect',
            content: (
                <>
                    <p className="mb-3">We collect information you provide directly to us, including:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Account information (name, email, password)</li>
                        <li>Profile information (skills, experience, resume)</li>
                        <li>Job postings and applications</li>
                        <li>Communication between users and recruiters</li>
                    </ul>
                </>
            ),
        },
        {
            title: '2. How We Use Your Information',
            content: (
                <>
                    <p className="mb-3">We use the information we collect to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Provide, maintain, and improve our services</li>
                        <li>Connect job seekers with relevant opportunities</li>
                        <li>Send you updates and communications about our services</li>
                        <li>Ensure platform security and prevent fraud</li>
                    </ul>
                </>
            ),
        },
        {
            title: '3. Information Sharing',
            content: (
                <p>
                    We do not sell your personal information. We share information only with your consent,
                    to comply with laws, or to protect our rights. Recruiters can view candidate profiles
                    and applications when candidates apply to their job postings.
                </p>
            ),
        },
        {
            title: '4. Data Security',
            content: (
                <p>
                    We implement appropriate security measures to protect your personal information.
                    However, no method of transmission over the internet is 100% secure, and we cannot
                    guarantee absolute security.
                </p>
            ),
        },
        {
            title: '5. Your Rights',
            content: (
                <>
                    <p className="mb-3">You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Access and update your personal information</li>
                        <li>Delete your account and associated data</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Request a copy of your data</li>
                    </ul>
                </>
            ),
        },
        {
            title: '6. Cookies',
            content: (
                <p>
                    We use cookies and similar technologies to improve your experience, analyze site
                    traffic, and personalize content. You can control cookies through your browser settings.
                </p>
            ),
        },
        {
            title: '7. Changes to This Policy',
            content: (
                <p>
                    We may update this privacy policy from time to time. We will notify you of any
                    significant changes by posting the new policy on this page and updating the
                    "Last Updated" date.
                </p>
            ),
        },
        {
            title: '8. Contact Us',
            content: (
                <p>
                    If you have any questions about this Privacy Policy, please contact us at{' '}
                    <a href="mailto:privacy@devhire.com" className="text-cyan-400 hover:text-cyan-300">
                        privacy@devhire.com
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
                        <Shield className="text-cyan-400" size={32} />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">Privacy Policy</h1>
                    <p className="text-slate-400">Last updated: {lastUpdated}</p>
                </div>

                {/* Introduction */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 mb-8">
                    <p className="text-slate-300 leading-relaxed">
                        At DevHire, we take your privacy seriously. This Privacy Policy explains how we
                        collect, use, and protect your personal information when you use our platform.
                        By using DevHire, you agree to the collection and use of information in accordance
                        with this policy.
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
