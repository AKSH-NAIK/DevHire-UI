'use client';

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/**
 * Reusable Modal wrapper
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - title: string
 *  - children: ReactNode
 *  - maxWidth: string (Tailwind class, default 'max-w-lg')
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
    const overlayRef = useRef(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // ESC key to close
    useEffect(() => {
        if (!isOpen) return
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handleKey)
        // Disable background scroll
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen || !mounted) return null

    // Click outside overlay closes modal
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose()
    }

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div
                className={`relative w-full ${maxWidth} bg-black border border-white/10 shadow-2xl shadow-black/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                    <h2 className="text-base font-bold text-white uppercase tracking-widest">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-500 hover:text-white transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto max-h-[80vh]">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}
