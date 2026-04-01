import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getSecret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET ?? "");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";

  const token = request.cookies.get("as_token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, getSecret());
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
