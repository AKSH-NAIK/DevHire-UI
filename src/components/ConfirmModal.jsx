'use client';

import { useEffect, useRef } from 'react'
import { AlertTriangle, X } from 'lucide-react'

/**
 * ConfirmModal — shows a styled confirmation dialog
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void
 *  - onConfirm: () => void
 *  - title: string
 *  - message: string
 *  - confirmText: string (default "Confirm")
 *  - confirmVariant: 'danger' | 'primary' (default 'danger')
 */
export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    confirmVariant = 'danger',
}) {
    const overlayRef = useRef(null)

    useEffect(() => {
        if (!isOpen) return
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose()
    }

    const confirmBtn =
        confirmVariant === 'danger'
            ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
            : 'border-primary text-primary hover:bg-primary hover:text-white'

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div className="relative w-full max-w-sm bg-black border border-white/10 shadow-2xl shadow-black/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 border border-red-900/50 bg-red-950/20 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle size={18} className="text-red-500" />
                        </div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-600 hover:text-white transition-colors mt-0.5"
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 border border-white/10 text-slate-400 hover:border-white/20 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose() }}
                        className={`flex-1 py-3 border transition-all text-xs font-bold uppercase tracking-widest ${confirmBtn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
