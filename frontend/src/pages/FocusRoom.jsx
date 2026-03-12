import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Users, Timer as TimerIcon, Play, Camera, Mic, PhoneOff, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function FocusRoom() {
    const { id } = useParams()
    const { user } = useAuth()
    const [room, setRoom] = useState(null)
    const [participants, setParticipants] = useState([])
    const [time, setTime] = useState(25 * 60)
    const [active, setActive] = useState(false)
    const socketRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Connect to socket
        const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000')
        socketRef.current = socket

        socket.emit('join:room', { roomId: id, user })

        socket.on('room:user_joined', ({ user }) => {
            setParticipants(prev => [...prev.filter(p => p.id !== user.id), user])
        })

        socket.on('room:user_left', ({ socketId }) => {
            // In a real app we'd track socketId -> userId mapping
        })

        socket.on('room:timer', ({ timerEnd, isActive }) => {
            setActive(isActive)
            const diff = Math.max(0, Math.floor((new Date(timerEnd) - new Date()) / 1000))
            setTime(diff)
        })

        return () => {
            socket.emit('leave:room', id)
            socket.disconnect()
        }
    }, [id])

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

    return (
        <div className="p-8 h-screen flex flex-col items-center justify-center bg-dark-bg selection:bg-primary-500/30">
            <div className="max-w-6xl w-full flex flex-col gap-8">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/team')} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                            <PhoneOff size={20} className="text-rose-500" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold font-outfit">Virtual Study Room</h1>
                            <p className="text-xs text-gray-400 flex items-center gap-1 uppercase tracking-widest leading-none mt-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {participants.length + 1} People Focusing
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 glass px-4 py-2 rounded-2xl">
                        <TimerIcon size={20} className="text-primary-500" />
                        <span className="text-2xl font-bold font-outfit tabular-nums">{formatTime(time)}</span>
                    </div>
                </header>

                {/* Video Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* Current User */}
                    <div className="aspect-[4/3] bg-dark-card border-2 border-primary-500/50 rounded-[2.5rem] overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold">You</div>
                            <span className="font-bold text-sm tracking-wide">Me (Focusing)</span>
                        </div>
                        <div className="absolute top-6 right-6 flex gap-2">
                            <div className="p-2 bg-black/40 backdrop-blur-md rounded-full text-emerald-400"><Zap size={14} /></div>
                        </div>
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <Camera size={48} className="text-gray-700" />
                        </div>
                    </div>

                    {/* Other Participants */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-[4/3] bg-dark-card border border-white/5 rounded-[2.5rem] overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-sm font-bold text-gray-400">Team Member {i}</div>
                            <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-800">
                                <Users size={48} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 mt-4">
                    <button className="p-5 rounded-3xl glass hover:bg-white/10 transition-all text-gray-400 hover:text-white"><Mic /></button>
                    <button className="p-5 rounded-3xl glass hover:bg-white/10 transition-all text-gray-400 hover:text-white"><Camera /></button>
                    <button className="px-10 py-5 rounded-3xl bg-primary-600 hover:bg-primary-500 font-bold transition-all shadow-2xl shadow-primary-600/30 flex items-center gap-3">
                        <TimerIcon /> Sync Timer
                    </button>
                </div>
            </div>
        </div>
    )
}
