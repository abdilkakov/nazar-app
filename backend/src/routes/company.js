const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/company — create company
router.post('/', auth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Company name required' });

        const company = await prisma.company.create({
            data: { name, adminId: req.userId },
        });
        // Add admin as member
        await prisma.companyMember.create({ data: { userId: req.userId, companyId: company.id } });
        res.json(company);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/company/my — companies this user belongs to
router.get('/my', auth, async (req, res) => {
    try {
        const memberships = await prisma.companyMember.findMany({
            where: { userId: req.userId },
            include: { company: true },
        });
        res.json(memberships.map(m => m.company));
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/company/:id/invite — invite by email
router.post('/:id/invite', auth, async (req, res) => {
    try {
        const company = await prisma.company.findUnique({ where: { id: req.params.id } });
        if (!company || company.adminId !== req.userId) {
            return res.status(403).json({ error: 'Only admin can invite' });
        }
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const existing = await prisma.companyMember.findUnique({
            where: { userId_companyId: { userId: user.id, companyId: company.id } },
        });
        if (existing) return res.status(409).json({ error: 'Already a member' });

        const member = await prisma.companyMember.create({ data: { userId: user.id, companyId: company.id } });
        res.json(member);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/company/:id/members
router.get('/:id/members', auth, async (req, res) => {
    try {
        const members = await prisma.companyMember.findMany({
            where: { companyId: req.params.id },
            include: { user: { select: { id: true, email: true, name: true, avatar: true, role: true } } },
        });
        res.json(members.map(m => ({ ...m.user, joinedAt: m.joinedAt })));
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/company/:id/analytics
router.get('/:id/analytics', auth, async (req, res) => {
    try {
        const members = await prisma.companyMember.findMany({ where: { companyId: req.params.id } });
        const userIds = members.map(m => m.userId);

        const sessions = await prisma.focusSession.findMany({
            where: { userId: { in: userIds }, endedAt: { not: null } },
            include: { user: { select: { id: true, name: true, avatar: true } } },
        });

        const userStats = {};
        sessions.forEach(s => {
            const uid = s.userId;
            if (!userStats[uid]) userStats[uid] = { user: s.user, totalMins: 0, distractions: 0, sessions: 0, scoreSum: 0 };
            userStats[uid].totalMins += s.endedAt ? (s.endedAt - s.startedAt) / 60000 : 0;
            userStats[uid].distractions += s.distractionCount;
            userStats[uid].sessions += 1;
            userStats[uid].scoreSum += s.focusScore || 0;
        });

        const result = Object.values(userStats).map(u => ({
            user: u.user,
            deepWorkHours: +(u.totalMins / 60).toFixed(2),
            distractions: u.distractions,
            sessions: u.sessions,
            avgFocusScore: u.sessions ? +(u.scoreSum / u.sessions).toFixed(1) : 0,
        }));

        const avgTeamScore = result.length ? result.reduce((a, u) => a + u.avgFocusScore, 0) / result.length : 0;
        res.json({ teamAvgFocusScore: +avgTeamScore.toFixed(1), members: result });
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/company/:id/leaderboard
router.get('/:id/leaderboard', auth, async (req, res) => {
    try {
        const members = await prisma.companyMember.findMany({ where: { companyId: req.params.id } });
        const userIds = members.map(m => m.userId);

        const sessions = await prisma.focusSession.findMany({
            where: { userId: { in: userIds }, endedAt: { not: null } },
            include: { user: { select: { id: true, name: true, avatar: true } } },
        });

        const map = {};
        sessions.forEach(s => {
            if (!map[s.userId]) map[s.userId] = { user: s.user, totalMins: 0, totalSessions: 0, scoreSum: 0 };
            map[s.userId].totalMins += s.endedAt ? (s.endedAt - s.startedAt) / 60000 : 0;
            map[s.userId].totalSessions += 1;
            map[s.userId].scoreSum += s.focusScore || 0;
        });

        const board = Object.values(map)
            .map(u => ({
                user: u.user,
                deepWorkHours: +(u.totalMins / 60).toFixed(2),
                sessions: u.totalSessions,
                avgFocusScore: u.totalSessions ? +(u.scoreSum / u.totalSessions).toFixed(1) : 0,
            }))
            .sort((a, b) => b.avgFocusScore - a.avgFocusScore)
            .map((u, i) => ({ rank: i + 1, ...u }));

        res.json(board);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
