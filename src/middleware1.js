// // /middleware.ts
// import { NextResponse } from "next/server";
// import { getIronSession } from "iron-session/edge";
// import getAuthSession from "@/lib/session";

// const sessionOptions = {
//   cookieName: "atysa_cookie",
//   password: process.env.COOKIE_PASSWORD || "test",
//   // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
//   cookieOptions: {
//     secure: process.env.NODE_ENV === "production",
//   },
// };

// export const middleware = async (req) => {
//   return;
//   // const authSession = getAuthSession(req);
//   // if (!authSession) {
//   //   return NextResponse.redirect(new URL("/login", req.url));
//   // }
// };
// export const config = {
//   matcher: "/me",
// };
