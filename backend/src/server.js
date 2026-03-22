import express from 'express';
import path from 'path';
import { ENV } from './lib/env.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API routes
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Success from API' });
});

// Serve frontend in production
if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // SPA fallback
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
} else {
    // Development 404 handler
    app.use((req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });
}

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: ENV.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// Start server
const server = app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
