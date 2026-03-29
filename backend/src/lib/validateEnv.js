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
    envResult = dotenv.config({ path: envPath });
    if (!envResult.error) {
        console.log(`✅ Loaded env from ${envPath}`);
        break;
    }
}

if (envResult?.error) {
    console.warn('⚠️ No .env file found in expected locations; relying on existing environment variables');
}

const requiredEnvVars = ['PORT', 'DB_URL', 'NODE_ENV'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
}

// Validate specific values
if (!['development', 'production', 'test'].includes(process.env.NODE_ENV)) {
    console.error('❌ NODE_ENV must be one of: development, production, test');
    process.exit(1);
}

if (isNaN(parseInt(process.env.PORT, 10)) || process.env.PORT < 1 || process.env.PORT > 65535) {
    console.error('❌ PORT must be a valid number between 1 and 65535');
    process.exit(1);
}

console.log('✅ Environment validation passed');
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   PORT: ${process.env.PORT}`);
