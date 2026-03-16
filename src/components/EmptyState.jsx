'use client';

import { Briefcase } from 'lucide-react'

/**
 * EmptyState — centered empty state with icon, title, message, and optional CTA
 * Props:
 *  - icon: ReactNode (default Briefcase)
 *  - title: string
 *  - message: string
 *  - action: { label: string, onClick: () => void } (optional)
 */
export default function EmptyState({ icon, title, message, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-8 text-center border border-white/5 bg-white/[0.02]">
            <div className="mb-6 text-slate-700">
                {icon || <Briefcase size={48} />}
            </div>
            {title && (
                <h3 className="text-white font-bold tracking-tight mb-2 uppercase text-sm">{title}</h3>
            )}
            {message && (
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest max-w-sm">{message}</p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-8 px-10 py-3 border border-primary text-primary hover:bg-primary hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
                >
                    {action.label}
                </button>
            )}
        </div>
    )
}
