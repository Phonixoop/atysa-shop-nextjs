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

@NextAuthGuard()
class OrderHandler {
  @Get()
  @HttpCode(200)
  async orders(
    @Req() req: NextApiRequest,
    @Query("cursor") cursor: string,
    @Query("orderStatuses") orderStatuses: string,
    @Query("limit", ParseNumberPipe({ nullable: true })) limit?: number
  ) {
    const orders = await prisma.order.findMany({
      where: {
        OR: {
          status: {
            in: orderStatuses.split(",") as any,
          },
        },
      },
      take: limit || 2,
      cursor:
        cursor?.length === 12
          ? {
              id: cursor,
            }
          : undefined,
      skip: cursor ? 1 : 0, // if skip is 1 it returns the first value twice, unless we are getting the first value in the db
      include: {
        user: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return {
      orders,
      nextId:
        orders.length === limit ? orders[orders.length - 1].id : undefined,
    };
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

// handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
//   const { user }: any = await getToken({ req });

//   if (!user.phonenumber) return res.status(401);
//   const {
//     basket_items,
//     tax,
//     has_coupon,
//     coupon_code,
//     coupon_discount,
//     total_price,
//   } = req.body;

//   const order = await prisma.order.create({
//     data: {
//       basket_items,
//       tax,
//       has_coupon,
//       coupon_code,
//       coupon_discount,
//       total_price,
//       user: {
//         connect: {
//           phonenumber: user.phonenumber,
//         },
//       },
//       status: "PURCHASED_AND_PENDING",
//     },
//   });
//   return res.json(order);
// });

export default createHandler(OrderHandler);
