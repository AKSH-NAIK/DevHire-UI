import React from "react";

export default function StatusBadge({ status }) {

    const baseStyle =
        "px-3 py-1.5 text-xs uppercase font-bold tracking-widest border";

    const statusStyles = {
        pending:
            "bg-yellow-500/20 border-yellow-500 text-yellow-400",
        shortlisted:
            "bg-green-500/20 border-green-500 text-green-400",
        rejected:
            "bg-red-500/20 border-red-500 text-red-400",
    };

    return (
        <span className={`${baseStyle} ${statusStyles[status] || statusStyles.pending}`}>
            {status}
        </span>
    );
}