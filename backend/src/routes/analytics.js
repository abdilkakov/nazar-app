const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/analytics/daily?days=7
router.get('/daily', auth, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const since = new Date();
        since.setDate(since.getDate() - days);

        const sessions = await prisma.focusSession.findMany({
            where: { userId: req.userId, startedAt: { gte: since }, endedAt: { not: null } },
            orderBy: { startedAt: 'asc' },
        });

        // Group by date
        const map = {};
        sessions.forEach(s => {
            const date = s.startedAt.toISOString().split('T')[0];
            if (!map[date]) map[date] = { date, deepWorkMins: 0, distractions: 0, sessions: 0, focusScore: 0 };
            const mins = s.endedAt ? (s.endedAt - s.startedAt) / 60000 : 0;
            map[date].deepWorkMins += mins;
            map[date].distractions += s.distractionCount;
            map[date].sessions += 1;
            map[date].focusScore += s.focusScore || 0;
        });

        const result = Object.values(map).map(d => ({
            ...d,
            deepWorkHours: +(d.deepWorkMins / 60).toFixed(2),
            focusScore: d.sessions ? +(d.focusScore / d.sessions).toFixed(1) : 0,
        }));

        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/analytics/summary
router.get('/summary', auth, async (req, res) => {
    try {
        const sessions = await prisma.focusSession.findMany({
            where: { userId: req.userId, endedAt: { not: null } },
        });
        const totalMins = sessions.reduce((acc, s) => acc + (s.endedAt ? (s.endedAt - s.startedAt) / 60000 : 0), 0);
        const totalDistractions = sessions.reduce((acc, s) => acc + s.distractionCount, 0);
        const avgFocusScore = sessions.length ? sessions.reduce((acc, s) => acc + (s.focusScore || 0), 0) / sessions.length : 0;

        res.json({
            totalSessions: sessions.length,
            totalDeepWorkHours: +(totalMins / 60).toFixed(2),
            totalDistractions,
            avgFocusScore: +avgFocusScore.toFixed(1),
        });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/analytics/productive-hours
router.get('/productive-hours', auth, async (req, res) => {
    try {
        const sessions = await prisma.focusSession.findMany({
            where: { userId: req.userId, endedAt: { not: null } },
        });

        const hourMap = Array.from({ length: 24 }, (_, h) => ({ hour: h, focusScore: 0, count: 0 }));
        sessions.forEach(s => {
            const h = s.startedAt.getHours();
            hourMap[h].focusScore += s.focusScore || 0;
            hourMap[h].count += 1;
        });
        const result = hourMap.map(h => ({ hour: h.hour, avgFocusScore: h.count ? +(h.focusScore / h.count).toFixed(1) : 0, sessions: h.count }));
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
