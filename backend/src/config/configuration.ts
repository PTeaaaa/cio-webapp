import { registerAs } from '@nestjs/config';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// Group 1: Application Configuration
const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT!, 10) || 3003,
  frontendUrlMain: process.env.FRONTEND_URL_MAIN || 'http://localhost:3000',
  frontendUrlAdmin: process.env.FRONTEND_URL_ADMIN || 'http://localhost:3002',
}));

// Group 2: Database Configuration
const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL!,
}));

// Group 3: JWT and Cookie Configuration
const jwtConfig = registerAs('jwt', () => ({
  secretKey: process.env.JWT_SECRET_KEY!,
  accessExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME || '1h',
  refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME || '7d',
  refreshCookieMaxAge: parseInt(process.env.JWT_REFRESH_COOKIE_MAX_AGE!, 10) || SEVEN_DAYS_MS,
  sessionExpiresIn: process.env.SESSION_EXPIRES_IN || '7d',
  cookieSecure: process.env.COOKIE_SECURE === 'true', // Converts 'true' string to boolean
  cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',
}));

// Group 4: MinIO (File Storage) Configuration
const minioConfig = registerAs('minio', () => ({
  endpoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT!, 10) || 9000,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSsl: process.env.MINIO_USE_SSL === 'true', // Converts 'true' string to boolean
  bucketName: process.env.MINIO_BUCKET_NAME || 'default-bucket',
}));

// Export all configurations in a single array
export default [appConfig, databaseConfig, jwtConfig, minioConfig];