import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  buildAdminSessionToken,
  isAdminConfigured,
} from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  if (!isAdminConfigured()) {
    return new NextResponse("Admin authentication is not configured", { status: 500 });
  }

  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return NextResponse.next();
  }

  const currentSession = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const expectedSession = buildAdminSessionToken();

  if (!currentSession || !expectedSession || currentSession !== expectedSession) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
