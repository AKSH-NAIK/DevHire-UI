import React from "react";

export default function StatusBadge({ status }) {

    const baseStyle =
        "px-3 py-1 text-[10px] uppercase font-bold tracking-widest border rounded-md";

    const statusStyles = {
        pending:
            "bg-amber-500/10 border-amber-500/30 text-amber-400",
        shortlisted:
            "bg-green-500/10 border-green-500/30 text-green-400",
        rejected:
            "bg-red-500/10 border-red-500/30 text-red-400",
    };

    return (
        <span className={`${baseStyle} ${statusStyles[status] || statusStyles.pending}`}>
            {status}
        </span>
    );
}