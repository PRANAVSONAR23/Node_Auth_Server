import dotenv from 'dotenv';
import { cleanEnv, str, port } from 'envalid';
dotenv.config();
const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
    PORT: port({ default: 8000 }),
    DATABASE_URL: str(),
    JWT_ACCESS_SECRET: str(),
    JWT_REFRESH_SECRET: str(),
    JWT_ACCESS_EXPIRY: str({ default: '15m' }),
    JWT_REFRESH_EXPIRY: str({ default: '7d' }),
    EMAIL_SERVICE: str(),
    EMAIL_USER: str(),
    EMAIL_PASS: str(),
    EMAIL_FROM: str(),
    APP_URL: str(),
    CLIENT_URL: str()
});
export default env;
