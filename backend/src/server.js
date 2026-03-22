import express from 'express';
import {ENV} from './lib/env.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({ msg: "Success from API" });
});

// Example API route - adapt to your video call app endpoints
app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// 404 catch-all for unknown routes
app.use((req, res) => {
    const id = `bom1::${Date.now()}-${Math.random().toString(36).slice(2)}`;
    res.status(404).json({
        error: 'NOT_FOUND',
        code: 'NOT_FOUND',
        id,
        path: req.originalUrl,
        message: 'Route not found. Verify API endpoint and frontend proxy settings.'
    });
});

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});