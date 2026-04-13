import { randomBytes } from "node:crypto";

export function generateSecureToken(length: number = 32): string {
  return randomBytes(length / 2).toString("hex");
}
