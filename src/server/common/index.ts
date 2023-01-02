import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import {
  createMiddlewareDecorator,
  UnauthorizedException,
  NextFunction,
} from "next-api-decorators";

export const NextAuthGuard = createMiddlewareDecorator(
  async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      throw new UnauthorizedException("UnauthorizedException");
    }
    const user = await prisma.user.findUnique({
      where: { phonenumber: (token.user as User).phonenumber },
    });
    req.user = user || undefined;
    next();
  }
);

export const isAdmin = createMiddlewareDecorator(
  async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      throw new UnauthorizedException("UnauthorizedException");
    }
    const userFromToken = token.user as User;
    if (userFromToken.role !== "ADMIN")
      throw new UnauthorizedException("UnauthorizedException");
    const user = await prisma.user.findUnique({
      where: { phonenumber: userFromToken.phonenumber },
    });

    req.user = user || undefined;
    next();
  }
);
