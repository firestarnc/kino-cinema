import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  buildAdminSessionToken,
  getAdminCredentials,
  isAdminConfigured,
} from "@/lib/admin-auth";

interface LoginPayload {
  username?: string;
  password?: string;
}

function variants(value: string): string[] {
  const base = value.trim();
  const items = new Set<string>([base]);

  // Support escaped dollar values from dotenv literals (e.g. \$).
  items.add(base.replace(/\\\$/g, "$"));

  // Next.js env expansion can swallow patterns like $5 in .env values.
  items.add(base.replace(/\$\d+/g, ""));

  try {
    const decoded = decodeURIComponent(base);
    items.add(decoded);
    items.add(decoded.replace(/\\\$/g, "$"));
    items.add(decoded.replace(/\$\d+/g, ""));
  } catch {
    // Ignore invalid URI sequences.
  }

  return Array.from(items);
}

export async function POST(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 500 });
  }

  const body = (await request.json()) as LoginPayload;
  const providedUsername = body.username ?? "";
  const providedPassword = body.password ?? "";

  const { username, password } = getAdminCredentials();
  if (!username || !password) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 500 });
  }

  const providedUsernameVariants = variants(providedUsername);
  const providedPasswordVariants = variants(providedPassword);
  const configuredUsernameVariants = variants(username);
  const configuredPasswordVariants = variants(password);

  const usernameMatches = configuredUsernameVariants.some((candidate) =>
    providedUsernameVariants.includes(candidate)
  );

  const passwordMatches = configuredPasswordVariants.some((candidate) =>
    providedPasswordVariants.includes(candidate)
  );

  if (!usernameMatches || !passwordMatches) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const sessionToken = buildAdminSessionToken();
  if (!sessionToken) {
    return NextResponse.json({ error: "Unable to create session" }, { status: 500 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
