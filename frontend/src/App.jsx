import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FocusSession from './pages/FocusSession'
import Analytics from './pages/Analytics'
import TeamWorkspace from './pages/TeamWorkspace'
import SocialFeed from './pages/SocialFeed'
import FocusRoom from './pages/FocusRoom'
import Sidebar from './components/Sidebar'

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 font-medium">Loading...</p>
            </div>
        </div>
    )
    if (!user) return <Navigate to="/login" />
    return children
}

function App() {
    const { user } = useAuth()

    return (
        <ToastProvider>
            <div className="flex min-h-screen bg-dark-bg text-gray-100">
                {user && <Sidebar />}
                <main className={`flex-1 ${user ? 'md:ml-64' : ''}`}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/focus" element={<ProtectedRoute><FocusSession /></ProtectedRoute>} />
                        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                        <Route path="/team" element={<ProtectedRoute><TeamWorkspace /></ProtectedRoute>} />
                        <Route path="/feed" element={<ProtectedRoute><SocialFeed /></ProtectedRoute>} />
                        <Route path="/rooms/:id" element={<ProtectedRoute><FocusRoom /></ProtectedRoute>} />
                    </Routes>
                </main>
            </div>
        </ToastProvider>
    )
}

export default App
