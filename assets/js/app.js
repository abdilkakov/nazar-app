// --- State Management ---
let state = {
    user: null,
    active: false,
    timer: 25 * 60,
    distractions: 0,
    distractedTimeMs: 0,
    isDistracted: false,
    cameraActive: false,
    modelsLoaded: false,
    detecting: false,
    currentSessionId: null
};

const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvasElement');
const timerDisplay = document.getElementById('timerDisplay');
const distractionCount = document.getElementById('distractionCount');
const sessionStatus = document.getElementById('sessionStatus');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const authView = document.getElementById('authView');
const sessionView = document.getElementById('sessionView');
const userHandle = document.getElementById('userHandle');
const debugInfo = document.getElementById('debugInfo');
const distractionTime = document.getElementById('distractionTime');
const awayAlert = document.getElementById('awayAlert');
const awayTimer = document.getElementById('awayTimer');
const guardStatus = document.getElementById('guardStatus');

// --- Auth logic ---
function login() {
    const handle = document.getElementById('handleInput').value.trim();
    if (!handle) return alert("Please enter a handle");

    state.user = handle;
    localStorage.setItem('nazar_user', handle);
    showSessionView();
}

function logout() {
    state.user = null;
    localStorage.removeItem('nazar_user');
    showAuthView();
    stopSession();
}

function showSessionView() {
    authView.style.display = 'none';
    sessionView.style.display = 'block';
    userHandle.textContent = state.user;
}

function showAuthView() {
    authView.style.display = 'block';
    sessionView.style.display = 'none';
}

// Check for existing user
const savedUser = localStorage.getItem('nazar_user');
if (savedUser) {
    state.user = savedUser;
    showSessionView();
} else {
    showAuthView();
}

// --- face-api.js logic ---
async function loadModels() {
    try {
        debugInfo.textContent = "Loading AI models...";
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('assets/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('assets/models')
        ]);
        state.modelsLoaded = true;
        debugInfo.textContent = "Models Ready";
    } catch (err) {
        console.error("Failed to load models", err);
        debugInfo.textContent = "Model Error";
    }
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        state.cameraActive = true;

        video.onloadedmetadata = () => {
            startDetection();
        };
    } catch (err) {
        console.error("Camera error", err);
        alert("Could not access camera. Please check permissions.");
    }
}

function stopCamera() {
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        state.cameraActive = false;
        state.detecting = false;
    }
}

async function startDetection() {
    if (!state.modelsLoaded) await loadModels();
    if (!state.cameraActive) return;

    state.detecting = true;
    let lastFaceDetected = Date.now();

    const detectLoop = async () => {
        if (!state.detecting || !state.cameraActive) return;

        const displaySize = {
            width: video.clientWidth,
            height: video.clientHeight
        };

        if (displaySize.width > 0 && displaySize.height > 0) {
            if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
                canvas.width = displaySize.width;
                canvas.height = displaySize.height;
            }

            try {
                const detections = await faceapi.detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.2 })
                ).withFaceLandmarks();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                debugInfo.textContent = `Faces: ${resizedDetections.length}`;

                let faceLookingForward = false;

                if (resizedDetections.length > 0) {
                    const detection = resizedDetections[0];
                    const landmarks = detection.landmarks;

                    // Simple Head Pose Heuristic
                    const noseTip = landmarks.positions[30];
                    const leftJawEdge = landmarks.positions[0];
                    const rightJawEdge = landmarks.positions[16];
                    const chin = landmarks.positions[8];
                    const leftEyeOuter = landmarks.positions[36];
                    const rightEyeOuter = landmarks.positions[45];
                    const eyeCenterY = (leftEyeOuter.y + rightEyeOuter.y) / 2;

                    const distLeft = Math.abs(noseTip.x - leftJawEdge.x);
                    const distRight = Math.abs(noseTip.x - rightJawEdge.x);
                    const yawRatio = distLeft / distRight;

                    const eyeToNose = noseTip.y - eyeCenterY;
                    const noseToChin = chin.y - noseTip.y;
                    const pitchRatio = eyeToNose / noseToChin;

                    // Looking away if head turned or looking down
                    let isLookingAway = (yawRatio < 0.5 || yawRatio > 2.0) || (pitchRatio > 1.7);

                    if (!isLookingAway) {
                        faceLookingForward = true;
                        ctx.strokeStyle = '#10b981';
                        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
                    } else {
                        ctx.strokeStyle = '#f43f5e';
                        ctx.fillStyle = 'rgba(244, 63, 94, 0.1)';
                    }

                    // Draw Landmarks for feedback
                    const landmarksToDraw = [landmarks.getLeftEye(), landmarks.getRightEye(), landmarks.getNose()];
                    landmarksToDraw.forEach(points => {
                        ctx.beginPath();
                        ctx.moveTo(points[0].x, points[0].y);
                        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
                        ctx.closePath();
                        ctx.stroke();
                        ctx.fill();
                    });
                }

                const now = Date.now();
                if (faceLookingForward) {
                    lastFaceDetected = now;
                    state.isDistracted = false;
                    if (awayAlert) awayAlert.style.display = 'none';
                } else if (now - lastFaceDetected > 3000) { // 3 seconds of absence or looking away
                    if (!state.isDistracted) {
                        state.isDistracted = true;
                        state.distractions++;
                        if (distractionCount) distractionCount.textContent = state.distractions;
                        if (awayAlert) awayAlert.style.display = 'flex';

                        // Log distraction locally
                        logDistractionLocally();
                    }
                }

            } catch (e) {
                console.error(e);
            }
        }

        setTimeout(detectLoop, 200);
    };

    detectLoop();
}

// --- Session Logic ---
let timerInterval;

function startSession() {
    state.currentSessionId = Date.now().toString(); // Local ID
    state.active = true;
    state.timer = 25 * 60;
    state.distractions = 0;
    state.distractedTimeMs = 0;
    state.isDistracted = false;

    if (distractionCount) distractionCount.textContent = "0";
    if (distractionTime) distractionTime.textContent = "0m 0s";
    if (awayTimer) awayTimer.textContent = "0s";
    if (guardStatus) {
        guardStatus.textContent = I18N.T[I18N.getCurrentLang()].status_active;
        guardStatus.style.color = "#10b981";
    }
    sessionStatus.style.display = 'flex';
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';

    startCamera();

    timerInterval = setInterval(() => {
        state.timer--;
        if (state.isDistracted) {
            state.distractedTimeMs += 1000;
        }
        updateTimerDisplay();
        updateDistractionDisplay();
        if (state.timer <= 0) stopSession();
    }, 1000);
}

function logDistractionLocally() {
    if (!state.currentSessionId) return;
    // For MVP local version, we just keep it in state
    // Could save to a history array in localStorage if needed
    console.log(`Distraction logged locally for session ${state.currentSessionId}`);
}

function stopSession() {
    state.active = false;
    // Save session to history before clearing
    const history = JSON.parse(localStorage.getItem('nazar_history') || '[]');
    history.push({
        id: state.currentSessionId,
        user: state.user,
        distractions: state.distractions,
        totalTime: 25 * 60 - state.timer,
        date: new Date().toISOString()
    });
    localStorage.setItem('nazar_history', JSON.stringify(history));

    state.currentSessionId = null;
    clearInterval(timerInterval);
    stopCamera();

    sessionStatus.style.display = 'none';
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';

    if (awayAlert) awayAlert.style.display = 'none';
    if (guardStatus) {
        guardStatus.textContent = I18N.T[I18N.getCurrentLang()].status_idling;
        guardStatus.style.color = "var(--text-muted)";
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateTimerDisplay() {
    const mins = Math.floor(state.timer / 60);
    const secs = state.timer % 60;
    timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Initial load
loadModels();
if (window.I18N) I18N.switchLang('en');
