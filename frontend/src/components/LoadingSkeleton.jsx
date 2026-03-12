export function SkeletonCard({ className = '' }) {
    return (
        <div className={`bg-dark-card border border-dark-border rounded-[2rem] p-6 animate-pulse ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5" />
                <div className="w-12 h-4 rounded bg-white/5" />
            </div>
            <div className="w-24 h-4 rounded bg-white/5 mb-2" />
            <div className="w-16 h-8 rounded bg-white/5" />
        </div>
    )
}

export function SkeletonChart({ className = '' }) {
    return (
        <div className={`bg-dark-card border border-dark-border rounded-[2rem] p-8 animate-pulse ${className}`}>
            <div className="w-32 h-6 rounded bg-white/5 mb-8" />
            <div className="h-80 w-full flex items-end gap-2 px-4">
                {Array.from({ length: 7 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex-1 bg-white/5 rounded-t-md"
                        style={{ height: `${30 + Math.random() * 50}%` }}
                    />
                ))}
            </div>
        </div>
    )
}

export function SkeletonHero({ className = '' }) {
    return (
        <div className={`bg-dark-card border border-dark-border rounded-[3rem] p-8 animate-pulse ${className}`}>
            <div className="w-28 h-3 rounded bg-white/5 mb-4" />
            <div className="w-20 h-12 rounded bg-white/5 mb-4" />
            <div className="w-full h-2 rounded-full bg-white/5" />
        </div>
    )
}
