import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

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
} from "next-api-decorators";

declare module "next" {
  interface NextApiRequest {
    user?: any;
  }
}

const NextAuthGuard = createMiddlewareDecorator(
  async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    if (!token) {
      throw new UnauthorizedException("UnauthorizedException");
    }

    req.user = token.user;
    next();
  }
);
const statuses = [
  "PURCHASED_AND_PENDING",
  "PURCHAS_ROLLED_BACK",
  "ACCEPTED",
  "ADMIN_REJECTED",
  "USER_REJECTED",
  "COOKING",
  "SENDING",
  "RECIVED",
];
@NextAuthGuard()
class OrderHandler {
  @Get()
  async orders(
    @Req() req: NextApiRequest,
    @Query("cursor") cursor: string,
    @Query("orderStatuses", DefaultValuePipe(statuses.join(",")))
    orderStatuses: string,
    @Query("limit", DefaultValuePipe(2), ParseNumberPipe({ nullable: true }))
    limit?: number
  ) {
    if (orderStatuses.split(",").includes("ALL"))
      orderStatuses = statuses.join(",");

    let result = {
      error: true,
      message: "",
      data: {},
    };

    try {
      const orders = await prisma.order.findMany({
        where: {
          OR: {
            status: {
              in: orderStatuses.split(",") as any,
            },
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
        include: {
          user: true,
        },
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

  @Post()
  async createOrder(@Req() req: NextApiRequest, @Body() body: any) {
    const {
      basket_items,
      tax,
      has_coupon,
      coupon_code,
      coupon_discount,
      total_price,
    } = body;

    const order = await prisma.order.create({
      data: {
        basket_items,
        tax,
        has_coupon,
        coupon_code,
        coupon_discount,
        total_price,
        user: {
          connect: {
            phonenumber: req.user.phonenumber,
          },
        },
        status: "PURCHASED_AND_PENDING",
      },
    });
    return order;
  }
}

export default createHandler(OrderHandler);
