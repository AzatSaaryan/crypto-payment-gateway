import * as crypto from 'crypto';

const KEY = Buffer.from(process.env.ENCRYPTION_KEY_BASE64!, 'base64');
if (KEY.length !== 32)
  throw new Error('ENCRYPTION_KEY_BASE64 must be 32 bytes (base64)');

export function encryptUtf8(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plain, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

export function decryptUtf8(dataB64: string): string {
  const b = Buffer.from(dataB64, 'base64');
  const iv = b.slice(0, 12);
  const tag = b.slice(12, 28);
  const ciphertext = b.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return out.toString('utf8');
}
