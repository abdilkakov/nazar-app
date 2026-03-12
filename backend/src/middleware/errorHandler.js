function errorHandler(err, req, res, next) {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Resource not found' });
    }

    if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Duplicate entry' });
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const status = err.status || err.statusCode || 500;
    res.status(status).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
}

module.exports = errorHandler;
