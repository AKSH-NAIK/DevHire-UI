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
        <div className="flex flex-col items-center gap-3">
            <div className={`${sizeMap[size]} border-primary border-t-transparent rounded-full animate-spin`} />
            {label && (
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
            )}
        </div>
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
