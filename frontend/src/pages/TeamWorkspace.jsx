import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserPlus, Trophy, LayoutGrid, List, X, Loader2, Mail } from 'lucide-react'
import api from '../api/client'
import { useToast } from '../components/Toast'

export default function TeamWorkspace() {
    const [companies, setCompanies] = useState([])
    const [currentCompany, setCurrentCompany] = useState(null)
    const [members, setMembers] = useState([])
    const [leaderboard, setLeaderboard] = useState([])
    const [loading, setLoading] = useState(true)
    const [showInvite, setShowInvite] = useState(false)
    const [inviteEmail, setInviteEmail] = useState('')
    const [inviting, setInviting] = useState(false)
    const toast = useToast()

    useEffect(() => {
        api.get('/company/my').then(res => {
            setCompanies(res.data)
            if (res.data.length > 0) {
                fetchCompanyData(res.data[0].id)
            } else {
                setLoading(false)
            }
        })
    }, [])

    const fetchCompanyData = async (id) => {
        try {
            const company = companies.find(c => c.id === id) || { id }
            setCurrentCompany(company)
            const [mems, lboard] = await Promise.all([
                api.get(`/company/${id}/members`),
                api.get(`/company/${id}/leaderboard`)
            ])
            setMembers(mems.data)
            setLeaderboard(lboard.data)
            setLoading(false)
        } catch (e) {
            console.error(e)
            setLoading(false)
        }
    }

    const handleInvite = async (e) => {
        e.preventDefault()
        if (!inviteEmail.trim() || !currentCompany) return
        setInviting(true)
        try {
            await api.post(`/company/${currentCompany.id}/invite`, { email: inviteEmail })
            toast?.success(`Invited ${inviteEmail} successfully!`)
            setInviteEmail('')
            setShowInvite(false)
            // Refresh members
            const mems = await api.get(`/company/${currentCompany.id}/members`)
            setMembers(mems.data)
        } catch (err) {
            const msg = err.response?.data?.error || 'Failed to invite'
            toast?.error(msg)
        } finally {
            setInviting(false)
        }
    }

    const handleCreateCompany = async () => {
        const name = prompt('Enter company name:')
        if (!name?.trim()) return
        try {
            const res = await api.post('/company', { name })
            setCompanies([...companies, res.data])
            setCurrentCompany(res.data)
            await fetchCompanyData(res.data.id)
            toast?.success(`"${name}" workspace created!`)
        } catch (err) {
            toast?.error('Failed to create workspace')
        }
    }

    if (loading) return <div className="p-8 text-gray-500">Syncing with team...</div>

    if (companies.length === 0) {
        return (
            <div className="p-8 max-w-4xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-primary-500/10 rounded-3xl flex items-center justify-center mb-8 text-primary-500">
                    <Users size={48} />
                </div>
                <h2 className="text-3xl font-bold mb-4">No Workspace Found</h2>
                <p className="text-gray-400 mb-8 max-w-md">Team features are available for B2B users. Create a workspace to invite your coworkers.</p>
                <button
                    onClick={handleCreateCompany}
                    className="bg-primary-600 hover:bg-primary-500 px-10 py-4 rounded-2xl font-bold text-lg transition-all"
                >
                    Create Company Workspace
                </button>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">{currentCompany?.name}</h1>
                    <p className="text-gray-400">Team productivity insights</p>
                </div>
                <button
                    onClick={() => setShowInvite(true)}
                    className="glass hover:bg-white/10 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all"
                >
                    <UserPlus size={20} /> Invite Members
                </button>
            </header>

            {/* Invite Modal */}
            {showInvite && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setShowInvite(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-dark-card border border-dark-border rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">Invite Team Member</h3>
                                <button
                                    onClick={() => setShowInvite(false)}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-sm text-gray-400 mb-6">
                                Enter the email address of the person you want to invite. They must already have a NazarApp account.
                            </p>
                            <form onSubmit={handleInvite}>
                                <div className="relative group mb-6">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="colleague@company.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowInvite(false)}
                                        className="flex-1 py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!inviteEmail.trim() || inviting}
                                        className="flex-1 bg-primary-600 hover:bg-primary-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                                    >
                                        {inviting ? <Loader2 className="animate-spin" size={18} /> : <><UserPlus size={18} /> Send Invite</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Members Grid */}
                    <div className="bg-dark-card border border-dark-border rounded-[2.5rem] p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Users className="text-primary-500" /> Team Members
                            </h3>
                            <div className="flex bg-white/5 p-1 rounded-lg">
                                <button className="p-1.5 bg-primary-500/20 text-primary-500 rounded-md"><LayoutGrid size={18} /></button>
                                <button className="p-1.5 text-gray-500"><List size={18} /></button>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {members.map(m => (
                                <div key={m.id} className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center gap-4 hover:bg-white/10 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">
                                        {m.name[0]}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-bold truncate">{m.name}</p>
                                        <p className="text-xs text-gray-500 truncate capitalize">{m.role}</p>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Company Analytics */}
                    <div className="bg-gradient-to-br from-dark-card to-indigo-950/20 border border-dark-border rounded-[2.5rem] p-8 min-h-64 flex flex-col justify-center text-center">
                        <h3 className="text-2xl font-bold mb-4">Global Productivity Stats</h3>
                        <p className="text-gray-400 mb-6">Your team is focusing together.</p>
                        <div className="flex justify-center gap-12">
                            <div>
                                <p className="text-3xl font-bold text-primary-500">{members.length}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Members</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-indigo-400">{leaderboard.length}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-dark-card border border-dark-border rounded-[2.5rem] overflow-hidden">
                    <div className="p-8 border-b border-dark-border bg-gradient-to-b from-primary-500/10 to-transparent">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Trophy className="text-amber-500" /> Leaderboard
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">TOP FOCUS SCORES — THIS WEEK</p>
                    </div>

                    <div className="p-4 space-y-2">
                        {leaderboard.length > 0 ? leaderboard.map((item, idx) => (
                            <div key={item.user.id} className={`flex items-center gap-4 p-4 rounded-2xl ${idx === 0 ? 'bg-primary-500/10 border border-primary-500/20 shadow-lg shadow-primary-500/5' : 'hover:bg-white/5 transition-all'}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-outfit ${idx < 3 ? 'text-amber-400' : 'text-gray-500'}`}>
                                    #{idx + 1}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                                    {item.user.name[0]}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-bold truncate">{item.user.name}</p>
                                    <p className="text-xs text-gray-500">{item.deepWorkHours}h worked</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary-500">{item.avgFocusScore}</p>
                                    <p className="text-[10px] text-gray-600 uppercase">Focus</p>
                                </div>
                            </div>
                        )) : (
                            <p className="p-8 text-center text-gray-600">No data for this week yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
