import { deflateSync, inflateSync } from 'zlib';

export function encryptContent(value?: string | null): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  try {
    const compressed = deflateSync(value);
    // Convert to base64 and make it URL-safe
    return compressed
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (error) {
    throw new Error(`Compression failed: ${(error as Error).message}`);
  }
}

export function decryptContent(value?: string | null): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  try {
    // Restore standard base64 from URL-safe base64
    let base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const buffer = Buffer.from(base64, 'base64');
    const decompressed = inflateSync(buffer);
    return decompressed.toString('utf8');
  } catch (error) {
    throw new Error(`Decompression failed: ${(error as Error).message}`);
  }
}
