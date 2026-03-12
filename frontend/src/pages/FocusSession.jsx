import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timer, Camera, CameraOff, XCircle, Play, Pause, Square, AlertTriangle, ShieldCheck, Zap } from 'lucide-react'
import * as faceapi from 'face-api.js'
import api from '../api/client'

export default function FocusSession() {
    const [active, setActive] = useState(false)
    const [time, setTime] = useState(25 * 60) // 25 mins
    const [duration, setDuration] = useState(25)
    const [distractions, setDistractions] = useState(0)
    const [distractedTimeMs, setDistractedTimeMs] = useState(0)
    const [cameraEnabled, setCameraEnabled] = useState(true)
    const [cameraActive, setCameraActive] = useState(false)
    const [sessionId, setSessionId] = useState(null)
    const [detecting, setDetecting] = useState(false)
    const [modelsLoaded, setModelsLoaded] = useState(false)
    const [debugText, setDebugText] = useState("Waiting for models...")

    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const isDistractedRef = useRef(false)
    const lastDistractedTickRef = useRef(0)
    const navigate = useNavigate()

    // Timer logic
    useEffect(() => {
        let interval
        if (active && time > 0) {
            interval = setInterval(() => {
                setTime(t => t - 1)

                // Accumulate distraction time precisely using a ref while active
                if (isDistractedRef.current && lastDistractedTickRef.current > 0) {
                    const now = Date.now()
                    const delta = now - lastDistractedTickRef.current
                    setDistractedTimeMs(prev => prev + delta)
                    lastDistractedTickRef.current = now
                } else if (isDistractedRef.current && lastDistractedTickRef.current === 0) {
                    lastDistractedTickRef.current = Date.now()
                } else {
                    lastDistractedTickRef.current = 0
                }

            }, 1000)
        } else if (time === 0 && active) {
            handleEndSession()
        }
        return () => clearInterval(interval)
    }, [active, time])

    // Camera start/stop
    useEffect(() => {
        if (cameraEnabled && active) {
            startCamera()
        } else {
            stopCamera()
        }
    }, [cameraEnabled, active])

    // Load models
    useEffect(() => {
        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models')
                ])
                setModelsLoaded(true)
            } catch (err) {
                console.error("Failed to load face-api models", err)
                setDebugText("Error loading models.")
            }
        }
        loadModels()
    }, [])

    // Ensure detection starts if camera is active AND models finish loading later
    useEffect(() => {
        if (cameraActive && modelsLoaded && !detecting) {
            startDetection()
        }
    }, [cameraActive, modelsLoaded, detecting])

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setCameraActive(true)
                // Wait for video to be ready before starting detection
                videoRef.current.onloadedmetadata = () => {
                    startDetection()
                }
            }
        } catch (err) {
            console.error(err)
            setCameraEnabled(false)
        }
    }

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop())
            videoRef.current.srcObject = null
            setCameraActive(false)
            setDetecting(false)
            isDistractedRef.current = false // reset
        }
    }

    const startDetection = () => {
        if (!modelsLoaded) return
        setDetecting(true)

        let lastFaceDetected = Date.now()
        let distractionLoggedForCurrentAbsence = false
        let isRunning = true

        const detectLoop = async () => {
            if (!videoRef.current || !canvasRef.current || !isRunning || !cameraActive) return

            const video = videoRef.current
            const canvas = canvasRef.current

            // Ensure canvas matches video *display* dimensions for accurate drawing
            const displaySize = {
                width: video.clientWidth,
                height: video.clientHeight
            }

            if (displaySize.width > 0 && displaySize.height > 0 && video.videoWidth > 0) {
                if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
                    canvas.width = displaySize.width
                    canvas.height = displaySize.height
                }

                try {
                    const detections = await faceapi.detectAllFaces(
                        video,
                        new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.2 })
                    ).withFaceLandmarks()

                    const resizedDetections = faceapi.resizeResults(detections, displaySize)

                    const now = Date.now()
                    const ctx = canvas.getContext('2d')
                    ctx.clearRect(0, 0, canvas.width, canvas.height)

                    setDebugText(`Video: ${video.videoWidth}x${video.videoHeight} | Canvas: ${canvas.width}x${canvas.height} | Faces: ${resizedDetections.length}`)

                    if (resizedDetections.length > 0) {
                        const detection = resizedDetections[0]
                        const landmarks = detection.landmarks

                        // Get eye and nose points
                        const leftEye = landmarks.getLeftEye()
                        const rightEye = landmarks.getRightEye()
                        const nose = landmarks.getNose()
                        const jawOutline = landmarks.getJawOutline()

                        // Draw Eye Polygons (Lines around the eyes)
                        ctx.strokeStyle = '#6366f1' // Primary color
                        ctx.lineWidth = 2
                        ctx.fillStyle = 'rgba(99, 102, 241, 0.2)'

                        const drawPolygon = (points) => {
                            ctx.beginPath()
                            ctx.moveTo(points[0].x, points[0].y)
                            for (let i = 1; i < points.length; i++) {
                                ctx.lineTo(points[i].x, points[i].y)
                            }
                            ctx.closePath()
                            ctx.stroke()
                            ctx.fill()
                        }

                        // Simple Head Pose Heuristic (Yaw and Pitch)
                        // 1. Yaw (Looking Left/Right)
                        const noseTip = landmarks.positions[30] // Tip of the nose
                        const leftJawEdge = landmarks.positions[0]
                        const rightJawEdge = landmarks.positions[16]

                        const distLeft = Math.abs(noseTip.x - leftJawEdge.x)
                        const distRight = Math.abs(noseTip.x - rightJawEdge.x)

                        let isHeadTurned = false
                        if (distLeft > 0 && distRight > 0) {
                            const yawRatio = distLeft / distRight
                            if (yawRatio < 0.5 || yawRatio > 2.0) {
                                isHeadTurned = true
                            }
                        }

                        // 2. Pitch (Looking Down at a phone)
                        // Compare vertical distance from eyes to nose vs nose to chin
                        const leftEyeOuter = landmarks.positions[36]
                        const rightEyeOuter = landmarks.positions[45]
                        const eyeCenterY = (leftEyeOuter.y + rightEyeOuter.y) / 2
                        const chin = landmarks.positions[8]

                        const eyeToNose = noseTip.y - eyeCenterY
                        const noseToChin = chin.y - noseTip.y

                        if (noseToChin > 0) {
                            const pitchRatio = eyeToNose / noseToChin
                            // When looking down, the nose appears closer to the chin and further from the eyes
                            // Normal ratio is around 0.8 - 1.2. If it goes above 1.7, they are looking down.
                            if (pitchRatio > 1.7) {
                                isHeadTurned = true
                            }
                        }

                        if (!isHeadTurned) {
                            // Face found and looking forward, reset absence timer
                            lastFaceDetected = now
                            distractionLoggedForCurrentAbsence = false
                            isDistractedRef.current = false
                            ctx.strokeStyle = '#10b981' // Green if focused
                        } else {
                            // Face found but turned away
                            ctx.strokeStyle = '#f43f5e' // Red if distracted
                        }

                        drawPolygon(leftEye)
                        drawPolygon(rightEye)
                    }

                    // Check absence or turned-away duration
                    const absenceDuration = now - lastFaceDetected

                    // If distracted (no face OR turned away) for more than 4 seconds
                    if (absenceDuration > 4000) {
                        isDistractedRef.current = true

                        // Track the distraction event hit only once per absence
                        if (!distractionLoggedForCurrentAbsence && sessionId) {
                            distractionLoggedForCurrentAbsence = true
                            setDistractions(d => d + 1)
                            logRealDistraction(absenceDuration)
                        }
                    } else {
                        isDistractedRef.current = false
                    }
                } catch (e) {
                    console.error("Face detection error:", e)
                }
            }

            // Schedule next frame
            if (isRunning) {
                setTimeout(detectLoop, 200)
            }
        }

        detectLoop()

        return () => {
            isRunning = false
            isDistractedRef.current = false
        }
    }

    const logRealDistraction = async (duration) => {
        if (!sessionId) return
        try {
            // Log the distraction based on actual absence
            await api.post(`/sessions/${sessionId}/distraction`, { durationMs: duration || 5000 })
        } catch (err) {
            console.error(err)
        }
    }

    const handleStartSession = async () => {
        try {
            const res = await api.post('/sessions', { plannedDuration: duration, cameraEnabled })
            setSessionId(res.data.id)
            setDistractions(0)
            setDistractedTimeMs(0)
            setActive(true)
            setTime(duration * 60)
        } catch (err) {
            console.error(err)
        }
    }

    const handleEndSession = async () => {
        if (!sessionId) return
        try {
            setActive(false)
            stopCamera()
            await api.patch(`/sessions/${sessionId}/end`)
            navigate('/analytics')
        } catch (err) {
            console.error(err)
        }
    }

    const logDistraction = async () => {
        if (!sessionId) return
        setDistractions(d => d + 1)
        await api.post(`/sessions/${sessionId}/distraction`, { durationMs: 2000 })
    }

    const formatTime = (s) => {
        const m = Math.floor(s / 60)
        const rs = s % 60
        return `${m}:${rs < 10 ? '0' : ''}${rs}`
    }

    const formatMs = (ms) => {
        const s = Math.floor(ms / 1000)
        const m = Math.floor(s / 60)
        const rs = s % 60
        return `${m}m ${rs}s`
    }

    return (
        <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-outfit">Focus Session</h1>
                    <p className="text-gray-400">Deep concentration in progress</p>
                </div>
                {!active && (
                    <div className="flex bg-dark-card border border-dark-border p-1.5 rounded-2xl">
                        {[25, 50, 90].map(d => (
                            <button
                                key={d}
                                onClick={() => setDuration(d)}
                                className={`px-6 py-2 rounded-xl font-bold transition-all ${duration === d ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                {d}m
                            </button>
                        ))}
                    </div>
                )}
            </header>

            <div className="flex-1 grid lg:grid-cols-2 gap-8 min-h-0">
                <div className="flex flex-col gap-8">
                    {/* Timer Card */}
                    <div className="bg-dark-card border border-dark-border rounded-[3rem] flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                        {active && (
                            <div className="absolute top-8 left-8 flex items-center gap-2 text-primary-500 font-medium animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-primary-500" />
                                Session Active
                            </div>
                        )}

                        <div className="text-[10rem] font-bold font-outfit leading-none mb-8 tabular-nums">
                            {formatTime(time)}
                        </div>

                        <div className="flex gap-4">
                            {!active ? (
                                <button
                                    onClick={handleStartSession}
                                    className="bg-primary-600 hover:bg-primary-500 px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 transition-all shadow-2xl shadow-primary-600/30"
                                >
                                    <Play className="fill-white" /> Start Deep Work
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setActive(!active)}
                                        className="glass hover:bg-white/10 p-5 rounded-2xl transition-all"
                                    >
                                        {active ? <Pause /> : <Play />}
                                    </button>
                                    <button
                                        onClick={handleEndSession}
                                        className="bg-rose-600 hover:bg-rose-500 p-5 rounded-2xl transition-all shadow-xl shadow-rose-600/20"
                                    >
                                        <Square className="fill-white" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-dark-card border border-dark-border p-6 rounded-[2rem] flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Distractions</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-bold">{distractions}</p>
                                    <p className="text-sm font-medium text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                                        {formatMs(distractedTimeMs)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => logRealDistraction(5000)}
                                className="ml-auto text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/5"
                            >
                                Simulate
                            </button>
                        </div>
                        <div className="bg-dark-card border border-dark-border p-6 rounded-[2rem] flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Focus Mode</p>
                                <p className="text-2xl font-bold">{cameraEnabled ? 'Guard On' : 'Off'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Camera Card */}
                    <div className="bg-dark-card border border-dark-border rounded-[3rem] flex-1 overflow-hidden relative group">
                        {!cameraActive && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-dark-bg/50 backdrop-blur-sm">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                                    <CameraOff size={40} className="text-gray-500" />
                                </div>
                                <p className="text-gray-400 font-medium">Camera is disabled</p>
                                <button
                                    onClick={() => setCameraEnabled(true)}
                                    className="mt-4 text-primary-500 hover:underline font-bold"
                                >
                                    Enable Focus Lock
                                </button>
                            </div>
                        )}

                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className={`absolute inset-0 w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700 ${!cameraActive && 'hidden'}`}
                        />

                        <canvas
                            ref={canvasRef}
                            // Ensure the canvas stretches exactly like object-cover without cropping internally
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover pointer-events-none z-10 ${!cameraActive && 'hidden'}`}
                        />

                        {cameraActive && (
                            <div className="absolute top-4 right-4 z-50 bg-black/70 text-white text-xs font-mono p-2 rounded-lg border border-white/20">
                                {debugText}
                            </div>
                        )}

                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="glass px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                                {cameraActive ? 'LIVE MONITORING' : 'IDLE'}
                            </div>
                            <button
                                onClick={() => setCameraEnabled(!cameraEnabled)}
                                className="p-3 rounded-full glass hover:bg-white/20 transition-all"
                            >
                                {cameraEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-primary-600/10 border border-primary-500/20 p-6 rounded-[2rem]">
                        <h4 className="font-bold flex items-center gap-2 mb-2">
                            <Zap size={18} className="text-primary-500" />
                            Privacy First
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Nazar analyzes your focus entirely in the browser. No video data or images ever leave your device.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
