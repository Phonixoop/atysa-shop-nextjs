// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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

  return NextResponse.next();
}
export const config = {
  matcher: "/me/:path*",
};
