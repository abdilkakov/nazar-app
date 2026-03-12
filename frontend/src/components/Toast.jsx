import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext()

const ICONS = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
}

const COLORS = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
    info: 'border-primary-500/30 bg-primary-500/10 text-primary-400',
}

function ToastItem({ toast, onClose }) {
    const Icon = ICONS[toast.type] || Info

    useEffect(() => {
        const timer = setTimeout(() => onClose(toast.id), 4000)
        return () => clearTimeout(timer)
    }, [toast.id, onClose])

    return (
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-lg shadow-2xl transition-all animate-slide-up ${COLORS[toast.type]}`}>
            <Icon size={20} />
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => onClose(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity">
                <X size={16} />
            </button>
        </div>
    )
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, message, type }])
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const toast = {
        success: (msg) => addToast(msg, 'success'),
        error: (msg) => addToast(msg, 'error'),
        info: (msg) => addToast(msg, 'info'),
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
                {toasts.map(t => (
                    <ToastItem key={t.id} toast={t} onClose={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => useContext(ToastContext)
