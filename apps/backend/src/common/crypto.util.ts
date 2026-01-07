import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { environment } from '../config/environment';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const ENV_KEY = environment.encryptionKey;

let cachedKey: Buffer | null = null;

function buildKey(): Buffer {
  if (!ENV_KEY) {
    throw new Error('APP_ENCRYPTION_KEY (or AI_CRYPTO_SECRET) is required');
  }

  // Support hex, base64, or utf8 secrets. Prefer hex/base64 to ensure entropy.
  if (/^[0-9a-fA-F]{64}$/.test(ENV_KEY)) {
    return Buffer.from(ENV_KEY, 'hex');
  }

  try {
    const base64 = Buffer.from(ENV_KEY, 'base64');
    if (base64.length === 32) {
      return base64;
    }
  } catch {
    // fall through to utf8
  }

  const utf8 = Buffer.from(ENV_KEY, 'utf8');
  if (utf8.length !== 32) {
    throw new Error('APP_ENCRYPTION_KEY must represent 32 bytes (256 bits)');
  }
  return utf8;
}

function getKey(): Buffer {
  if (!cachedKey) {
    cachedKey = buildKey();
  }
  return cachedKey;
}

export function encryptContent(value?: string | null): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString('hex'),
    encrypted.toString('hex'),
    tag.toString('hex'),
  ].join(':');
}

export function decryptContent(value?: string | null): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const parts = value.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted payload');
  }

  const [ivHex, dataHex, tagHex] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(dataHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');

  const decipher = createDecipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
