import { useState, useEffect, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Calendar, Download, Target, Zap, Clock, Shield, Check } from 'lucide-react'
import api from '../api/client'
import { SkeletonCard, SkeletonChart, SkeletonHero } from '../components/LoadingSkeleton'
import { useToast } from '../components/Toast'

const DATE_RANGES = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 14 Days', days: 14 },
    { label: 'Last 30 Days', days: 30 },
]

export default function Analytics() {
    const [dailyData, setDailyData] = useState([])
    const [productiveHours, setProductiveHours] = useState([])
    const [summary, setSummary] = useState(null)
    const [loading, setLoading] = useState(true)
    const [days, setDays] = useState(7)
    const [showRangeMenu, setShowRangeMenu] = useState(false)
    const toast = useToast()

    const fetchData = (numDays) => {
        setLoading(true)
        Promise.all([
            api.get(`/analytics/daily?days=${numDays}`),
            api.get('/analytics/productive-hours'),
            api.get('/analytics/summary')
        ]).then(([daily, hours, sum]) => {
            setDailyData(daily.data)
            setProductiveHours(hours.data)
            setSummary(sum.data)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchData(days)
    }, [days])

    const handleExportCSV = () => {
        if (!dailyData.length) {
            toast?.info('No data to export')
            return
        }

        const headers = ['Date', 'Focus Score', 'Deep Work Hours', 'Distractions', 'Sessions']
        const rows = dailyData.map(d => [
            d.date,
            d.focusScore,
            d.deepWorkHours,
            d.distractions,
            d.sessions
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `nazar-analytics-${days}days-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        URL.revokeObjectURL(url)
        toast?.success('CSV exported successfully!')
    }

    const currentRangeLabel = DATE_RANGES.find(r => r.days === days)?.label || `Last ${days} Days`

    // Compute real "Best Time to Start" from productive hours data
    const bestHour = useMemo(() => {
        if (!productiveHours.length) return '—'
        const best = productiveHours.reduce((a, b) => (b.avgFocusScore > a.avgFocusScore ? b : a), productiveHours[0])
        if (best.avgFocusScore === 0) return '—'
        const h = best.hour
        const period = h >= 12 ? 'PM' : 'AM'
        const display = h === 0 ? 12 : h > 12 ? h - 12 : h
        return `${display}:00 ${period}`
    }, [productiveHours])

    // Compute real average session length
    const avgSessionLength = useMemo(() => {
        if (!summary || !summary.totalSessions || summary.totalSessions === 0) return '—'
        const avgMins = Math.round((summary.totalDeepWorkHours * 60) / summary.totalSessions)
        return `${avgMins} Mins`
    }, [summary])

    // Compute weekly growth
    const weeklyGrowth = useMemo(() => {
        if (dailyData.length < 4) return '—'
        const firstHalf = dailyData.slice(0, Math.floor(dailyData.length / 2))
        const secondHalf = dailyData.slice(Math.floor(dailyData.length / 2))
        const avgFirst = firstHalf.reduce((a, d) => a + d.focusScore, 0) / firstHalf.length
        const avgSecond = secondHalf.reduce((a, d) => a + d.focusScore, 0) / secondHalf.length
        if (avgFirst === 0) return '—'
        const growth = ((avgSecond - avgFirst) / avgFirst * 100).toFixed(1)
        return `${growth > 0 ? '+' : ''}${growth}%`
    }, [dailyData])

    if (loading) return (
        <div className="p-8 max-w-7xl mx-auto pb-32">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <div className="w-48 h-8 rounded bg-white/5 animate-pulse mb-2" />
                    <div className="w-64 h-4 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="flex gap-4">
                    <div className="w-32 h-10 rounded-xl bg-white/5 animate-pulse" />
                    <div className="w-32 h-10 rounded-xl bg-white/5 animate-pulse" />
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <SkeletonHero />
                <SkeletonHero />
                <SkeletonHero />
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
                <SkeletonChart />
                <SkeletonChart />
            </div>
        </div>
    )

    return (
        <div className="p-8 max-w-7xl mx-auto pb-32">
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">Analytics & Insights</h1>
                    <p className="text-gray-400">Deep dive into your productivity patterns</p>
                </div>
                <div className="flex gap-4">
                    {/* Date Range Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowRangeMenu(!showRangeMenu)}
                            className="glass px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-white/10 transition-all"
                        >
                            <Calendar size={18} /> {currentRangeLabel}
                        </button>
                        {showRangeMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowRangeMenu(false)} />
                                <div className="absolute right-0 top-full mt-2 z-50 bg-dark-card border border-dark-border rounded-xl shadow-2xl overflow-hidden min-w-[180px]">
                                    {DATE_RANGES.map(range => (
                                        <button
                                            key={range.days}
                                            onClick={() => { setDays(range.days); setShowRangeMenu(false) }}
                                            className={`w-full px-4 py-3 text-left text-sm font-medium flex items-center justify-between gap-4 transition-colors ${days === range.days
                                                    ? 'bg-primary-500/10 text-primary-500'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            {range.label}
                                            {days === range.days && <Check size={16} />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <button
                        onClick={handleExportCSV}
                        className="bg-white text-black px-6 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-gray-200 transition-all"
                    >
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </header>

            {/* Hero Stats */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-dark-card border border-dark-border p-8 rounded-[3rem] relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Focus Score</p>
                    <h2 className="text-5xl font-bold font-outfit mb-4">{summary?.avgFocusScore || 0}%</h2>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${summary?.avgFocusScore || 0}%` }} />
                    </div>
                </div>
                <div className="bg-dark-card border border-dark-border p-8 rounded-[3rem]">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Deep Work Total</p>
                    <h2 className="text-5xl font-bold font-outfit mb-4">{summary?.totalDeepWorkHours || 0}h</h2>
                    <div className="flex items-center gap-2 overflow-hidden">
                        {dailyData.length > 0 ? dailyData.map((d, i) => (
                            <div key={i} className="flex-1 h-8 bg-primary-500/20 rounded-md relative group">
                                <div className="absolute bottom-0 w-full bg-primary-500 rounded-md transition-all duration-700" style={{ height: `${Math.min(100, (d.deepWorkHours / 4) * 100)}%` }} />
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500">No data yet</p>
                        )}
                    </div>
                </div>
                <div className="bg-primary-600 border border-primary-500 p-8 rounded-[3rem] text-white shadow-2xl shadow-primary-600/20">
                    <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-2">Session Summary</p>
                    <h2 className="text-3xl font-bold font-outfit mb-4">{summary?.totalSessions || 0} Sessions</h2>
                    <p className="text-sm text-white/80 leading-relaxed mb-6">
                        {summary?.totalDistractions || 0} total distractions across all sessions.
                    </p>
                    <div className="w-full h-8 bg-black/10 rounded-xl flex items-center justify-center font-bold text-xs uppercase">
                        {summary?.totalDeepWorkHours || 0}h Deep Work
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-dark-card border border-dark-border p-8 rounded-[3rem]">
                    <h3 className="text-xl font-bold mb-8">Daily Activity</h3>
                    <div className="h-80 w-full">
                        {dailyData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                    <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickFormatter={(v) => v.split('-').slice(2)} />
                                    <YAxis stroke="#6b7280" fontSize={11} />
                                    <Tooltip contentStyle={{ backgroundColor: '#161618', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                                    <Area type="monotone" dataKey="focusScore" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No data yet</div>
                        )}
                    </div>
                </div>

                <div className="bg-dark-card border border-dark-border p-8 rounded-[3rem]">
                    <h3 className="text-xl font-bold mb-8">Peak Productivity Hours</h3>
                    <div className="h-80 w-full">
                        {productiveHours.some(h => h.sessions > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={productiveHours}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                    <XAxis dataKey="hour" stroke="#6b7280" fontSize={11} tickFormatter={(h) => `${h}:00`} />
                                    <YAxis stroke="#6b7280" fontSize={11} />
                                    <Tooltip contentStyle={{ backgroundColor: '#161618', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                                    <Bar dataKey="avgFocusScore" fill="#6366f1" radius={[20, 20, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">No data yet</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4">
                    <Clock className="text-indigo-400" size={32} />
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase">Best Time to Start</p>
                        <p className="text-xl font-bold">{bestHour}</p>
                    </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                    <Shield className="text-emerald-400" size={32} />
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase">Avg. Session Length</p>
                        <p className="text-xl font-bold">{avgSessionLength}</p>
                    </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex items-center gap-4">
                    <Zap className="text-amber-400" size={32} />
                    <div>
                        <p className="text-gray-500 text-xs font-bold uppercase">Weekly Growth</p>
                        <p className="text-xl font-bold">{weeklyGrowth}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
