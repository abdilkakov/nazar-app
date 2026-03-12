const express = require('express');
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/social/:companyId/feed
router.get('/:companyId/feed', auth, async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { companyId: req.params.companyId },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                reactions: true,
                comments: {
                    include: { user: { select: { id: true, name: true, avatar: true } } },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        res.json(posts);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/social/:companyId/posts
router.post('/:companyId/posts', auth, async (req, res) => {
    try {
        const { content, type } = req.body;
        if (!content) return res.status(400).json({ error: 'Content required' });

        const post = await prisma.post.create({
            data: {
                userId: req.userId,
                companyId: req.params.companyId,
                content,
                type: type || 'post',
            },
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                reactions: true,
                comments: [],
            },
        });

        // Emit real-time via socket (io injected on req.app)
        const io = req.app.get('io');
        if (io) io.to(req.params.companyId).emit('feed:new', post);

        res.json(post);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/social/posts/:id/reactions
router.post('/posts/:id/reactions', auth, async (req, res) => {
    try {
        const { type } = req.body;
        // Upsert reaction
        const existing = await prisma.reaction.findUnique({
            where: { postId_userId: { postId: req.params.id, userId: req.userId } },
        });
        if (existing) {
            await prisma.reaction.delete({ where: { postId_userId: { postId: req.params.id, userId: req.userId } } });
            return res.json({ removed: true });
        }
        const reaction = await prisma.reaction.create({
            data: { postId: req.params.id, userId: req.userId, type: type || 'like' },
        });
        res.json(reaction);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/social/posts/:id/comments
router.post('/posts/:id/comments', auth, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ error: 'Content required' });
        const comment = await prisma.comment.create({
            data: { postId: req.params.id, userId: req.userId, content },
            include: { user: { select: { id: true, name: true, avatar: true } } },
        });
        res.json(comment);
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
