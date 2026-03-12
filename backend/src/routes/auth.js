const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const router = express.Router();

function signToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, name, password, role } = req.body;
        if (!email || !name || !password) {
            return res.status(400).json({ error: 'email, name, password required' });
        }
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) return res.status(409).json({ error: 'Email already registered' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, name, passwordHash, role: role || 'employee' },
        });
        const token = signToken(user.id);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

        const token = signToken(user.id);
        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar } });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PATCH /api/auth/profile
router.patch('/profile', require('../middleware/auth'), async (req, res) => {
    try {
        const { name, avatar, role } = req.body;
        const user = await prisma.user.update({
            where: { id: req.userId },
            data: { ...(name && { name }), ...(avatar && { avatar }), ...(role && { role }) },
            select: { id: true, email: true, name: true, role: true, avatar: true },
        });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
