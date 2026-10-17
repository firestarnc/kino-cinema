import { createHash, randomBytes } from "node:crypto";

export const HALLOWEEN_TIMEZONE = "Africa/Lagos";
export const HALLOWEEN_VOTING_START = "2026-10-29T00:00:00+01:00";
export const HALLOWEEN_VOTING_END = "2026-10-31T12:00:00+01:00";
export const HALLOWEEN_MIN_FORM_TIME_MS = 4000;
export const HALLOWEEN_TOKEN_TTL_HOURS = 24;

const DEFAULT_DISPOSABLE_DOMAINS = [
  "10minutemail.com",
  "dispostable.com",
  "emailondeck.com",
  "fakeinbox.com",
  "getnada.com",
  "guerrillamail.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mintemail.com",
  "moakt.com",
  "sharklasers.com",
  "spamgourmet.com",
  "temp-mail.org",
  "tempail.com",
  "tempmail.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
  "fakemail.net",
];

export interface HalloweenCandidate {
  id: string;
  display_name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HalloweenVote {
  id: string;
  candidate_id: string;
  full_name: string;
  email: string;
  email_normalized: string;
  phone_number: string;
  verification_token_hash: string | null;
  token_expires_at: string | null;
  verified_at: string | null;
  verified_ip_address: string | null;
  verified_user_agent: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface HalloweenVoteAttempt {
  id: string;
  email_normalized: string | null;
  ip_address: string | null;
  outcome: string;
  reason: string | null;
  created_at: string;
}

export interface HalloweenVoteRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  candidateId?: string;
  formStartedAt?: string | number | null;
  honeypot?: string;
}

export interface HalloweenVerificationToken {
  token: string;
  tokenHash: string;
}

export function sanitizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeEmail(email: string): string {
  return sanitizeText(email).toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhoneNumber(phoneNumber: string): boolean {
  const compact = phoneNumber.replace(/[\s()-]/g, "");
  return compact.length >= 8 && /^[+\d][\d\s()-]+$/.test(phoneNumber);
}

export function isVotingWindowOpen(now = new Date()): boolean {
  const currentTime = now.getTime();
  return currentTime >= Date.parse(HALLOWEEN_VOTING_START) && currentTime <= Date.parse(HALLOWEEN_VOTING_END);
}

export function isHumanSubmission(formStartedAt: string | number | null | undefined, now = Date.now()): boolean {
  if (formStartedAt === null || formStartedAt === undefined || formStartedAt === "") {
    return false;
  }

  const startedAt = typeof formStartedAt === "number" ? formStartedAt : Number(formStartedAt);
  if (!Number.isFinite(startedAt)) {
    return false;
  }

  return now - startedAt >= HALLOWEEN_MIN_FORM_TIME_MS;
}

export function generateVerificationToken(): HalloweenVerificationToken {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashVerificationToken(token),
  };
}

export function hashVerificationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getDisposableDomains(): Set<string> {
  const envDomains = (process.env.HALLOWEEN_DISPOSABLE_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return new Set([...DEFAULT_DISPOSABLE_DOMAINS, ...envDomains]);
}

export function isDisposableEmail(email: string): boolean {
  const normalizedEmail = normalizeEmail(email);
  const atIndex = normalizedEmail.lastIndexOf("@");
  if (atIndex === -1) {
    return true;
  }

  const domain = normalizedEmail.slice(atIndex + 1);
  return getDisposableDomains().has(domain);
}

export function getRequestIp(headers: Headers): string | null {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  const realIp = headers.get("x-real-ip")?.trim();
  return realIp || null;
}

export function getRequestUserAgent(headers: Headers): string | null {
  return headers.get("user-agent")?.trim() || null;
}

export function isValidHalloweenVotePayload(payload: HalloweenVoteRequest): payload is Required<Pick<HalloweenVoteRequest, "fullName" | "email" | "phoneNumber" | "candidateId" | "formStartedAt" | "honeypot">> {
  const fullName = sanitizeText(payload.fullName);
  const email = normalizeEmail(payload.email ?? "");
  const phoneNumber = sanitizeText(payload.phoneNumber);
  const candidateId = sanitizeText(payload.candidateId);
  const honeypot = sanitizeText(payload.honeypot);

  return (
    fullName.length >= 2 &&
    isValidEmail(email) &&
    isValidPhoneNumber(phoneNumber) &&
    candidateId.length >= 8 &&
    honeypot.length === 0 &&
    isHumanSubmission(payload.formStartedAt)
  );
}

export const HALLOWEEN_SUCCESS_MESSAGE =
  "If your details are eligible, we have sent a verification link to your email address.";

export const HALLOWEEN_GENERIC_ERROR_MESSAGE =
  "We could not process your vote right now. Please try again later.";

export function normalizeCandidateSlug(displayName: string): string {
  return sanitizeText(displayName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}