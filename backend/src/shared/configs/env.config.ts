import 'dotenv/config';

const requiredEnv = (key: string): string => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
};

export const ENV = {
    PORT: Number(process.env.PORT ?? 8000),
    GEMINI_EMBEDDING_API_KEY: requiredEnv('GEMINI_EMBEDDING_API_KEY'),
    AUTH_JWT_ACCESS_SECRET: requiredEnv('AUTH_JWT_ACCESS_SECRET'),
    AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN ?? '2h',
};
