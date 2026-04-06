import express from 'express';
import path from 'path';
import { ENV } from './lib/env.js';
import { fileURLToPath } from 'url';
import { connect } from 'http2';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import {serve} from 'inngest/express';
import {inngest, functions} from './lib/inngest.js';
import { clerkMiddleware } from '@clerk/express'
import { protectRoute } from './middleware/protectRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

// credentials:true meaning?? =>server allows a browser to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true})); // Adjust CORS settings as needed
app.use(clerkMiddleware()) //This adds auth field to request object: req.auth()

app.use("/api/inngest", serve({client:inngest, functions})); // Inngest endpoint for handling events

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});


// When you pass an array of middleware to Express, it automatically flattens and executes them sequentially,one by one.
app.get("/video-calls",protectRoute,(req,res) =>{
    res.status(200).json({msg:"This is a Protected Route"});
})
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
const startServer = async () => {
    app.listen(ENV.PORT, () => {console.log(`🚀 Server running on port ${ENV.PORT} [${ENV.NODE_ENV}]`);
    });
    try {
        await connectDB();
    } catch (error) {
        console.error('💥 Error connecting to DB:', error.message);
    }
};
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
