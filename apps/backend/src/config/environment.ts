import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { z } from 'zod';

const logger = new Logger('Environment');

const envSchema = z.object({
  APP_ENCRYPTION_KEY: z.string().trim().optional(),
  AI_CRYPTO_SECRET: z.string().trim().optional(),
  FRONTEND_URL: z.string().trim().optional(),
  FRONTEND_URLS: z.string().trim().optional(),
  PORT: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .pipe(z.number().int().positive().max(65535).optional()),
});

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const normalizeOrigins = (
  rawOrigins: string | undefined,
  fallbackOrigin: string,
  warnings: string[],
): string[] => {
  const entries = (rawOrigins ?? fallbackOrigin)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const normalized = entries
    .map((origin) => {
      if (!isHttpUrl(origin)) {
        warnings.push(
          `Origin "${origin}" is not a valid http(s) URL and will be ignored.`,
        );
        return null;
      }
      return new URL(origin).origin;
    })
    .filter((origin): origin is string => origin !== null);

  if (!normalized.length) {
    throw new Error(
      'No valid frontend origins configured. Please set FRONTEND_URL or FRONTEND_URLS.',
    );
  }

  return normalized;
};

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'env'}: ${issue.message}`)
      .join('; ');

    throw new Error(`Environment validation failed: ${details}`);
  }

  const env = result.data;
  const warnings: string[] = [];

  const encryptionKey = env.APP_ENCRYPTION_KEY || env.AI_CRYPTO_SECRET;
  if (!encryptionKey) {
    throw new Error('APP_ENCRYPTION_KEY (or AI_CRYPTO_SECRET) is required.');
  }

  if (!env.APP_ENCRYPTION_KEY && env.AI_CRYPTO_SECRET) {
    warnings.push(
      'APP_ENCRYPTION_KEY is not set; falling back to AI_CRYPTO_SECRET.',
    );
  }

  const frontendUrl = env.FRONTEND_URL ?? 'http://localhost:3000';
  if (!isHttpUrl(frontendUrl)) {
    throw new Error('FRONTEND_URL must be a valid http(s) URL when provided.');
  }

  if (!env.FRONTEND_URL && !env.FRONTEND_URLS) {
    warnings.push(
      'FRONTEND_URL is not set; defaulting to http://localhost:3000 for redirects and CORS.',
    );
  }

  const frontendOrigins = normalizeOrigins(
    env.FRONTEND_URLS,
    frontendUrl,
    warnings,
  );

  const port = env.PORT ?? 4020;
  if (!env.PORT) {
    warnings.push('PORT is not set; defaulting to 4020.');
  }

  if (warnings.length) {
    logger.warn(`Environment warnings:\n- ${warnings.join('\n- ')}`);
  }

  return {
    encryptionKey,
    frontendUrl: new URL(frontendUrl).origin,
    frontendOrigins,
    port,
  } as const;
};

export const environment = parseEnv();

export type Environment = typeof environment;
