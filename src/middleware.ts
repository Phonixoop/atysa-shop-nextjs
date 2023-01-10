// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { User } from "@prisma/client";

const sessionOptions = {
  cookieName: "atysa_cookie",
  password: process.env.COOKIE_PASSWORD || "test",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const user = token.user as User;
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  console.log(req.nextUrl.pathname, user.role);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/me/:path*",
    "/admin/:path*",
  ],
};
