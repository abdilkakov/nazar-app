const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/sessions — start a new session
router.post('/', auth, async (req, res) => {
    try {
        const { plannedDuration, cameraEnabled } = req.body;
        const session = await prisma.focusSession.create({
            data: {
                userId: req.userId,
                plannedDuration: plannedDuration || 25,
                cameraEnabled: cameraEnabled !== false,
            },
        });
        res.json(session);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// PATCH /api/sessions/:id/end
router.patch('/:id/end', auth, async (req, res) => {
    try {
        const session = await prisma.focusSession.findFirst({ where: { id: req.params.id, userId: req.userId } });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        const endedAt = new Date();
        const durationMins = (endedAt - session.startedAt) / 60000;
        // Focus score: 100 - (distractions * 5), min 0, max 100
        const focusScore = Math.max(0, Math.min(100, 100 - session.distractionCount * 5));

        const updated = await prisma.focusSession.update({
            where: { id: session.id },
            data: { endedAt, focusScore },
        });
        res.json(updated);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/sessions/:id/distraction — log distraction event
router.post('/:id/distraction', auth, async (req, res) => {
    try {
        const session = await prisma.focusSession.findFirst({ where: { id: req.params.id, userId: req.userId } });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        const { durationMs } = req.body;
        await prisma.distractionEvent.create({ data: { sessionId: session.id, durationMs: durationMs || 0 } });
        const updated = await prisma.focusSession.update({
            where: { id: session.id },
            data: { distractionCount: { increment: 1 } },
        });
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/sessions — list user sessions
router.get('/', auth, async (req, res) => {
    try {
        const sessions = await prisma.focusSession.findMany({
            where: { userId: req.userId },
            orderBy: { startedAt: 'desc' },
            take: 50,
        });
        res.json(sessions);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
