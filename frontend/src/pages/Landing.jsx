import { Link } from 'react-router-dom'
import { Zap, Shield, BarChart2, Users as UsersIcon, ArrowRight } from 'lucide-react'

export default function Landing() {
    return (
        <div className="min-h-screen bg-dark-bg selection:bg-primary-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                            <Zap size={20} className="text-white fill-white" />
                        </div>
                        <span className="text-xl font-bold font-outfit">NazarApp</span>
                    </div>
                    <div className="flex items-center gap-8">
                        <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
                        <Link to="/register" className="bg-primary-600 hover:bg-primary-500 px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg shadow-primary-600/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm font-medium mb-8">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        Empowering Modern Productivity
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold font-outfit mb-8 leading-[1.1] tracking-tight">
                        Focus Better. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Work Smarter.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        The all-in-one productivity platform for individuals and teams.
                        Analyze distractions, track deep work, and achieve your goals with camera-powered focus detection.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-600/30 flex items-center justify-center gap-2">
                            Start Free Session <ArrowRight size={20} />
                        </Link>
                        <button className="w-full sm:w-auto glass hover:bg-white/10 px-10 py-4 rounded-2xl font-bold text-lg transition-all">
                            Book B2B Demo
                        </button>
                    </div>

                    {/* Mock Dashboard Preview */}
                    <div className="mt-24 relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-[2.5rem] blur opacity-20" />
                        <div className="relative bg-dark-card border border-white/10 rounded-[2rem] overflow-hidden aspect-[16/9] shadow-2xl shadow-black/50">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                            <div className="p-8 flex flex-col h-full">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="w-32 h-2 bg-white/10 rounded-full" />
                                </div>
                                <div className="grid grid-cols-4 gap-6 flex-1">
                                    <div className="col-span-3 bg-white/5 rounded-2xl border border-white/5 p-6">
                                        <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-xl" />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-primary-500/20 h-32 rounded-2xl border border-primary-500/20" />
                                        <div className="bg-white/5 h-32 rounded-2xl border border-white/5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-32 bg-dark-card/50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-16">Everything you need to stay focused</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="p-8 rounded-[2rem] glass border-white/10 card-hover">
                            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Focus Detection</h3>
                            <p className="text-gray-400 leading-relaxed">
                                On-device camera analysis detects when you lose focus without sacrificing your privacy.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] glass border-white/10 card-hover">
                            <div className="w-14 h-14 bg-primary-500/20 rounded-2xl flex items-center justify-center mb-6 text-primary-400">
                                <BarChart2 size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Deep Analytics</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Visualize your productivity peaks and valleys with detailed session reports and daily trends.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] glass border-white/10 card-hover">
                            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400">
                                <UsersIcon size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Team Leaderboards</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Spark healthy competition with social feeds, reactions, and focus scores across your team.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
