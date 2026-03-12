import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Timer, Zap, AlertCircle, CheckCircle2, TrendingUp, Users } from 'lucide-react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { SkeletonCard, SkeletonChart } from '../components/LoadingSkeleton'

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-dark-card border border-dark-border p-6 rounded-[2rem] card-hover">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon size={24} />
            </div>
        </div>
        <p className="text-gray-400 font-medium">{label}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
)

export default function Dashboard() {
    const { user } = useAuth()
    const [summary, setSummary] = useState(null)
    const [dailyStats, setDailyStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        Promise.all([
            api.get('/analytics/summary'),
            api.get('/analytics/daily')
        ]).then(([sum, daily]) => {
            setSummary(sum.data)
            setDailyStats(daily.data)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setError('Failed to load dashboard data')
            setLoading(false)
        })
    }, [])

    if (loading) return (
        <div className="p-8 max-w-7xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="w-64 h-10 rounded-lg bg-white/5 animate-pulse mb-2" />
                    <div className="w-48 h-5 rounded bg-white/5 animate-pulse" />
                </div>
                <div className="w-48 h-14 rounded-2xl bg-white/5 animate-pulse" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <SkeletonChart className="lg:col-span-2" />
                <SkeletonChart />
            </div>
        </div>
    )

    if (error) return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl">
                {error}
            </div>
        </div>
    )

    return (
        <div className="p-8 max-w-7xl mx-auto pb-24">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold font-outfit">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
                    <p className="text-gray-400 mt-2 text-lg">Ready to conquer your deep work sessions?</p>
                </div>
                <Link
                    to="/focus"
                    className="bg-primary-600 hover:bg-primary-500 px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-3 group"
                >
                    <Timer className="group-hover:rotate-12 transition-transform" />
                    Start Focus Session
                </Link>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                    label="Deep Work Hours"
                    value={`${summary?.totalDeepWorkHours || 0}h`}
                    icon={Zap}
                    color="bg-primary-500/10 text-primary-500"
                />
                <StatCard
                    label="Focus Score"
                    value={summary?.avgFocusScore || 0}
                    icon={CheckCircle2}
                    color="bg-emerald-500/10 text-emerald-500"
                />
                <StatCard
                    label="Distractions"
                    value={summary?.totalDistractions || 0}
                    icon={AlertCircle}
                    color="bg-rose-500/10 text-rose-500"
                />
                <StatCard
                    label="Total Sessions"
                    value={summary?.totalSessions || 0}
                    icon={TrendingUp}
                    color="bg-amber-500/10 text-amber-500"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 bg-dark-card border border-dark-border p-8 rounded-[2rem]">
                    <h3 className="text-xl font-bold mb-8">Focus Trends</h3>
                    {dailyStats.length > 0 ? (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#161618', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        itemStyle={{ color: '#6366f1' }}
                                    />
                                    <Line type="monotone" dataKey="focusScore" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                            <p>No session data yet. Start your first focus session!</p>
                        </div>
                    )}
                </div>

                <div className="bg-dark-card border border-dark-border p-8 rounded-[2rem]">
                    <h3 className="text-xl font-bold mb-8">Productive Hours</h3>
                    {dailyStats.length > 0 ? (
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickFormatter={(val) => val.split('-').slice(2)} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#161618', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    />
                                    <Bar dataKey="deepWorkHours" fill="#6366f120" radius={[4, 4, 0, 0]} stroke="#6366f1" strokeWidth={1} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-gray-500">
                            <p>Complete a session to see stats</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gradient-to-br from-primary-600/20 to-indigo-600/20 border border-primary-500/20 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h3 className="text-2xl font-bold mb-2">Build focusing habits together</h3>
                    <p className="text-gray-400">Invite your team to NazarApp and unlock social productivity features.</p>
                </div>
                <Link to="/team" className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2">
                    <Users size={20} />
                    Go to Workspace
                </Link>
            </div>
        </div>
    )
}
