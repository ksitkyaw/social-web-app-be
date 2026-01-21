import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function generateSecretHash(key: string) {
  const salt = randomBytes(8).toString("hex");
  const buffer = scryptSync(key, salt, 64);
  return `${buffer.toString("hex")}.${salt}`;
}

export function compareKeys({
  storedKey,
  suppliedKey,
}: {
  storedKey: string;
  suppliedKey: string;
}) {
  const [hashedPassword, salt] = storedKey.split(".");

  const buffer = scryptSync(suppliedKey, salt, 64);
  const storedBuffer = Buffer.from(hashedPassword, "hex");
  if (storedBuffer.length !== buffer.length) {
    return false;
  }
  return timingSafeEqual(
    storedBuffer as unknown as NodeJS.ArrayBufferView,
    buffer as unknown as NodeJS.ArrayBufferView,
  );
}

export function generateAuthToken() {
  return randomBytes(32).toString("hex");
}