import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try .env in backend/ first, then backend/src/ for local dev setups.
const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env')
];

let envResult;
for (const envPath of envPaths) {
    envResult = dotenv.config({ path: envPath ,quiet: true});
    if (!envResult.error) {
        console.log(`✅ Loaded env from ${envPath}`);
        break;
    }
}

if (envResult?.error) {
    console.warn('⚠️ No .env file found in expected locations; relying on existing environment variables');
}

const requiredEnvVars = ['PORT', 'DB_URL', 'NODE_ENV'];

// Validate required environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

export const ENV = {
    PORT: parseInt(process.env.PORT, 10),
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL ,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    STREAM_API_SECRET: process.env.STREAM_API_SECRET
};