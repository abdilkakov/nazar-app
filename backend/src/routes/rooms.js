const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/rooms/:companyId — create focus room
router.post('/:companyId', auth, async (req, res) => {
    try {
        const { name } = req.body;
        const room = await prisma.focusRoom.create({
            data: { companyId: req.params.companyId, name: name || 'Focus Room' },
        });
        res.json(room);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/rooms/:companyId — list rooms
router.get('/:companyId', auth, async (req, res) => {
    try {
        const rooms = await prisma.focusRoom.findMany({ where: { companyId: req.params.companyId } });
        res.json(rooms);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/rooms/join/:roomId — join room (socket handles the rest)
router.post('/join/:roomId', auth, async (req, res) => {
    try {
        const room = await prisma.focusRoom.findUnique({ where: { id: req.params.roomId } });
        if (!room) return res.status(404).json({ error: 'Room not found' });
        res.json({ room, userId: req.userId });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/rooms/start/:roomId — start room timer
router.post('/start/:roomId', auth, async (req, res) => {
    try {
        const { durationMins } = req.body;
        const timerEnd = new Date(Date.now() + (durationMins || 25) * 60 * 1000);
        const room = await prisma.focusRoom.update({
            where: { id: req.params.roomId },
            data: { isActive: true, timerEnd },
        });
        const io = req.app.get('io');
        if (io) io.to(req.params.roomId).emit('room:timer', { timerEnd: room.timerEnd, isActive: true });
        res.json(room);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
