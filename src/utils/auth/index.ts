import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function generateSecretHash(key: string) {
  const salt = randomBytes(8).toString('hex');
  const buffer = scryptSync(key, salt, 64);
  return `${buffer.toString('hex')}.${salt}`;
}

export function compareKeys({ storedKey, suppliedKey }: { storedKey: string, suppliedKey: string }) {
  const [hashedPassword, salt] = storedKey.split('.');

  const buffer = scryptSync(suppliedKey, salt, 64);
  return timingSafeEqual(Buffer.from(hashedPassword, 'hex'), buffer);
}