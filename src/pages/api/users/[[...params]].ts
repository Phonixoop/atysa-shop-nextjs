import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import { OrderStatus } from "@prisma/client";
import { withError, withSuccess } from "helpers/index";
import {
  createHandler,
  createMiddlewareDecorator,
  Get,
  ParseNumberPipe,
  Query,
  Req,
  UnauthorizedException,
  NextFunction,
  Post,
  Body,
  HttpCode,
  DefaultValuePipe,
  Put,
  Param,
} from "next-api-decorators";

declare module "next" {
  interface NextApiRequest {
    user?: User;
  }
}

const isAdmin = createMiddlewareDecorator(
  async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      throw new UnauthorizedException("UnauthorizedException");
    }
    const user = token.user as User;
    if (user.role !== "ADMIN")
      throw new UnauthorizedException("UnauthorizedException");
    req.user = user;
    next();
  }
);

const NextAuthGuard = createMiddlewareDecorator(
  async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      throw new UnauthorizedException("UnauthorizedException");
    }

    req.user = token.user as User;
    next();
  }
);

@NextAuthGuard()
class OrderHandler {
  @Get("")
  async users(
    @Req() req: NextApiRequest,
    @Query("cursor") cursor: string,
    @Query("limit", DefaultValuePipe(2), ParseNumberPipe({ nullable: true }))
    limit?: number
  ) {
    let result = {
      error: true,
      message: "",
      data: {},
    };

    try {
      const users = await prisma.user.findMany({
        take: limit,
        cursor:
          cursor?.length === 24
            ? {
                id: cursor,
              }
            : undefined,
        skip: cursor && cursor?.length === 24 ? 1 : 0, // if skip is 1 it returns the first value twice, unless we are getting the first value in the db
        orderBy: {
          created_at: "desc",
        },
      });
      result = {
        error: false,
        message: "",
        data: {
          users,
          nextId:
            users.length === limit ? users[users.length - 1].id : undefined,
        },
      };
    } catch (e) {
      result.message = e;
    } finally {
      return result;
    }
  }
  @Get("/orders")
  async orders(
    @Req() req: NextApiRequest,
    @Query("cursor") cursor: string,
    @Query("limit", DefaultValuePipe(4), ParseNumberPipe({ nullable: true }))
    limit?: number
  ) {
    let result = {
      error: true,
      message: "",
      data: {},
    };

    try {
      const orders = await prisma.order.findMany({
        where: {
          user: {
            id: req.user.id,
          },
        },
        take: limit,
        cursor:
          cursor?.length === 24
            ? {
                id: cursor,
              }
            : undefined,
        skip: cursor && cursor?.length === 24 ? 1 : 0, // if skip is 1 it returns the first value twice, unless we are getting the first value in the db
        orderBy: {
          created_at: "desc",
        },
      });
      result = {
        error: false,
        message: "",
        data: {
          orders,
          nextId:
            orders.length === limit ? orders[orders.length - 1].id : undefined,
        },
      };
    } catch (e) {
      result.message = e;
    } finally {
      return result;
    }
  }
  @Get("/me")
  async me(@Req() req: NextApiRequest) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          phonenumber: req.user.phonenumber,
        },
      });
      delete user.code;
      return withSuccess({ data: { user } });
    } catch {
      throw Error("error");
    }
  }
  @Put("/me")
  async updateUser(
    @Req() req: NextApiRequest,
    @Body()
    body: {
      first_name?: string;
      last_name?: string;
      addresses?: [{ id: number; title: string; description: string }];
    }
  ) {
    try {
      const user = await prisma.user.update({
        where: {
          phonenumber: req.user.phonenumber,
        },
        data: {
          ...body,
        },
      });
      console.log(body);
      return withSuccess({ data: { user } });
    } catch (e) {
      console.log(e);
      throw Error();
    }
  }
}

export default createHandler(OrderHandler);
