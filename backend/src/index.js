require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const sessionsRoutes = require('./routes/sessions');
const analyticsRoutes = require('./routes/analytics');
const companyRoutes = require('./routes/company');
const socialRoutes = require('./routes/social');
const roomsRoutes = require('./routes/rooms');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || true,
        credentials: true
    },
});

app.set('io', io);

// Middleware
app.use(cors({
    origin: '*', // For MVP development, allow all. In production, this should be restricted.
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per window
    message: { error: 'Too many attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/rooms', roomsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Global error handler (must be after routes)
app.use(errorHandler);

// Socket.IO
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('join:company', (companyId) => {
        socket.join(companyId);
    });

    socket.on('join:room', ({ roomId, user }) => {
        socket.join(roomId);
        socket.to(roomId).emit('room:user_joined', { user, socketId: socket.id });
    });

    socket.on('leave:room', (roomId) => {
        socket.leave(roomId);
        socket.to(roomId).emit('room:user_left', { socketId: socket.id });
    });

    socket.on('room:heartbeat', (roomId) => {
        socket.to(roomId).emit('room:heartbeat', { socketId: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, '0.0.0.0', () => console.log(`NazarApp backend running on port ${PORT}`));
