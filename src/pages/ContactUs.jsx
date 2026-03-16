import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        alert('Thank you for your message! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', subject: '', message: '' })
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-screen bg-[#1F1F1F]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                {/* Header */}
                <div className="text-left mb-24">
                    <div className="inline-flex items-center justify-center w-12 h-12 border border-primary mb-8">
                        <Mail className="text-primary" size={24} />
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 uppercase tracking-tighter">Contact Us</h1>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.3em]">Get in touch with our team</p>
                </div>

                <div className="grid md:grid-cols-2 gap-24">
                    {/* Contact Information */}
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-white uppercase tracking-tight">
                                Contact Information
                            </h2>
                            <p className="text-slate-500 leading-relaxed uppercase text-[11px] font-bold tracking-wider max-w-md">
                                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                            </p>
                        </div>

                        <div className="space-y-px bg-white/5 border border-white/5">
                            {/* Email */}
                            <div className="flex items-start gap-6 bg-[#1F1F1F] p-8 hover:bg-white/[0.02] transition-all group">
                                <div className="border border-white/10 p-3 group-hover:border-primary transition-colors">
                                    <Mail className="text-slate-500 group-hover:text-primary transition-colors" size={20} />
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-white text-[10px] font-bold uppercase tracking-widest mb-2">Email</h3>
                                    <a
                                        href="mailto:devhiresupport@example.com"
                                        className="text-slate-500 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        devhiresupport@example.com
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-6 bg-[#1F1F1F] p-8 hover:bg-white/[0.02] transition-all group">
                                <div className="border border-white/10 p-3 group-hover:border-primary transition-colors">
                                    <Phone className="text-slate-500 group-hover:text-primary transition-colors" size={20} />
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-white text-[10px] font-bold uppercase tracking-widest mb-2">Phone</h3>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">+91 9867840585</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-6 bg-[#1F1F1F] p-8 hover:bg-white/[0.02] transition-all group">
                                <div className="border border-white/10 p-3 group-hover:border-primary transition-colors">
                                    <MapPin className="text-slate-500 group-hover:text-primary transition-colors" size={20} />
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-white text-[10px] font-bold uppercase tracking-widest mb-2">Office</h3>
                                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                        Dombivli, Kalyan
                                        <br />
                                        Maharashtra, INDIA
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-[#1F1F1F] border border-white/10 p-10 shadow-glow-sm">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Name */}
                            <div className="space-y-3">
                                <label
                                    htmlFor="name"
                                    className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                                >
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 bg-[#1F1F1F] border border-white/10 text-white placeholder-slate-800 focus:outline-none focus:border-primary transition-all text-[10px] font-bold uppercase tracking-widest"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label
                                    htmlFor="email"
                                    className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 bg-[#1F1F1F] border border-white/10 text-white placeholder-slate-800 focus:outline-none focus:border-primary transition-all text-[10px] font-bold lowercase tracking-widest"
                                    placeholder="john@example.com"
                                />
                            </div>

                            {/* Subject */}
                            <div className="space-y-3">
                                <label
                                    htmlFor="subject"
                                    className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                                >
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 bg-[#1F1F1F] border border-white/10 text-white placeholder-slate-800 focus:outline-none focus:border-primary transition-all text-[10px] font-bold uppercase tracking-widest"
                                    placeholder="How can we help?"
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-3">
                                <label
                                    htmlFor="message"
                                    className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-5 py-4 bg-[#1F1F1F] border border-white/10 text-white placeholder-slate-800 focus:outline-none focus:border-primary transition-all text-[10px] font-bold uppercase tracking-widest resize-none"
                                    placeholder="Type your message here..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full px-8 py-5 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-glow-sm flex items-center justify-center gap-3"
                            >
                                Send Message
                                <Send size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
