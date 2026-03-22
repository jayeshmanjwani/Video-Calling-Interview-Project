import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
    NODE_ENV: process.env.NODE_ENV || 'development'
};