import { env } from './env.js';

const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  const normalizedOrigin = origin.trim();

  if (env.NODE_ENV === 'development' && localhostPattern.test(normalizedOrigin)) {
    return true;
  }

  const allowedOrigins = env.ALLOWED_ORIGINS.split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return allowedOrigins.includes(normalizedOrigin);
}
