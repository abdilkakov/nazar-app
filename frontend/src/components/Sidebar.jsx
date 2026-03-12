import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Timer, BarChart3, Users, MessageSquare, LogOut, Zap, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const SidebarItem = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
            ? 'bg-primary-500/10 text-primary-500 border-l-4 border-primary-500'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
)

export default function Sidebar() {
    const location = useLocation()
    const { logout, user } = useAuth()
    const [mobileOpen, setMobileOpen] = useState(false)

    const menuItems = [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/focus', icon: Timer, label: 'Focus Session' },
        { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/team', icon: Users, label: 'Team Workspace' },
        { to: '/feed', icon: MessageSquare, label: 'Social Feed' },
    ]

    const closeMobile = () => setMobileOpen(false)

    const sidebarContent = (
        <>
            <div className="flex items-center justify-between px-4 mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Zap size={20} className="text-white fill-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-white">NazarApp</h1>
                </div>
                <button
                    onClick={closeMobile}
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.to}
                        {...item}
                        active={location.pathname === item.to}
                        onClick={closeMobile}
                    />
                ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-dark-border">
                <div className="flex items-center gap-3 px-4 py-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-50 md:hidden p-3 bg-dark-card border border-dark-border rounded-xl text-gray-400 hover:text-white transition-colors shadow-lg"
            >
                <Menu size={20} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={closeMobile}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 w-64 bg-dark-card border-r border-dark-border flex flex-col p-4 z-50
                transition-transform duration-300 ease-in-out
                md:translate-x-0
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {sidebarContent}
            </div>
        </>
    )
}
