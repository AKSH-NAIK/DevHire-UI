'use client';

/**
 * Loader / Spinner component
 * Usage:
 *   <Loader /> — inline small spinner
 *   <Loader size="lg" /> — larger spinner
 *   <Loader fullScreen /> — centered full-screen overlay
 */
export default function Loader({ size = 'sm', fullScreen = false, label = '' }) {
    const sizeMap = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-10 h-10 border-2',
        xl: 'w-16 h-16 border-2',
    }

    const spinner = (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <div className={`${sizeMap[size]} border-primary/20 border-t-primary rounded-full animate-spin`} />
                <div className={`${sizeMap[size]} absolute inset-0 border-white/5 border-t-transparent rounded-full animate-spin [animation-duration:1.5s]`} />
            </div>
            {label && (
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">{label}</p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center glass-dark backdrop-blur-xl">
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                {spinner}
            </div>
        )
    }

    return spinner
}

/**
 * Inline button spinner (white, small) for use inside buttons
 */
export function ButtonSpinner() {
    return (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
    )
}
