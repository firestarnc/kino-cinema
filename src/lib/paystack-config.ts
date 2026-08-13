function normalizeEnvValue(value?: string): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Hosting panels sometimes save values wrapped in quotes.
  const unquoted = trimmed.replace(/^['"]|['"]$/g, "").trim();
  return unquoted || null;
}

export function getPaystackSecretKey(): string | null {
  return normalizeEnvValue(process.env.PAYSTACK_SECRET_KEY);
}

export function getPaystackPublicKey(): string | null {
  return normalizeEnvValue(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
}
