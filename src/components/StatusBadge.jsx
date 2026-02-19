'use client';

/**
 * StatusBadge — shows a colored badge for application or job status
 *
 * Application statuses:
 *   applied   → yellow
 *   reviewed  → blue
 *   accepted  → green
 *   rejected  → red
 *   pending   → slate
 *
 * Job statuses:
 *   active    → primary (cyan)
 *   inactive  → slate
 */
const STATUS_STYLES = {
    applied: 'border-yellow-700/50 bg-yellow-950/40 text-yellow-400',
    reviewed: 'border-blue-700/50 bg-blue-950/40 text-blue-400',
    accepted: 'border-green-700/50 bg-green-950/40 text-green-400',
    rejected: 'border-red-700/50 bg-red-950/40 text-red-400',
    pending: 'border-slate-700/50 bg-slate-900/40 text-slate-400',
    active: 'border-primary/30 bg-primary/5 text-primary shadow-glow-sm',
    inactive: 'border-slate-700/50 bg-slate-900/40 text-slate-500',
}

const STATUS_LABELS = {
    applied: 'Applied',
    reviewed: 'Reviewed',
    accepted: 'Accepted',
    rejected: 'Rejected',
    pending: 'Pending',
    active: 'Active',
    inactive: 'Inactive',
}

export default function StatusBadge({ status = 'pending' }) {
    const key = status?.toLowerCase() || 'pending'
    const styles = STATUS_STYLES[key] || STATUS_STYLES.pending
    const label = STATUS_LABELS[key] || status

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 border text-[10px] font-bold uppercase tracking-widest ${styles}`}
        >
            {label}
        </span>
    )
}
