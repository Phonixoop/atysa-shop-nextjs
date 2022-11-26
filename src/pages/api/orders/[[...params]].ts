import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import { OrderStatus } from "@prisma/client";

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
  HttpException,
  ForbiddenException,
} from "next-api-decorators";
import { withError, withSuccess } from "helpers/index";

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

// Helper
const StringIsNumber = (value) => isNaN(Number(value)) === false;

// Turn enum into array
function ToArray(enumme) {
  return Object.keys(enumme)
    .filter(StringIsNumber)
    .map((key) => enumme[key]);
}

const OrderStatusArray = Object.values(OrderStatus) as OrderStatus[];
@NextAuthGuard()
class OrderHandler {
  @Get()
  async orders(
    @Req() req: NextApiRequest,
    @Query("cursor") cursor: string,
    @Query("orderStatuses", DefaultValuePipe(OrderStatusArray.join(",")))
    orderStatuses: string,
    @Query("limit", DefaultValuePipe(2), ParseNumberPipe({ nullable: true }))
    limit?: number
  ) {
    if (orderStatuses.split(",").includes("ALL"))
      orderStatuses = OrderStatusArray.join(",");

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

  @Put("/:id/orderstatus")
  async updateOrder(
    @Req() req: NextApiRequest,
    @Body()
    body: {
      orderStatus: OrderStatus;
    },
    @Param("id") id: string
  ) {
    let result = {
      error: true,
      message: "",
      data: {},
    };

    // user only can change order status to USER_REJECTED
    if (
      req.user.role === "USER" &&
      (body.orderStatus as OrderStatus) !== "USER_REJECTED"
    )
      throw new ForbiddenException("");

    // admin can do anything, da! , obviously

    try {
      const singleOrder = await prisma.order.findUnique({ where: { id } });
      if (singleOrder.status !== "PURCHASED_AND_PENDING")
        throw new ForbiddenException("");
      const order = await prisma.order.update({
        where: {
          id,
        },
        data: {
          status: body.orderStatus,
        },
      });
      result = {
        error: false,
        message: "",
        data: {
          order,
        },
      };
      return withSuccess({ data: order });
    } catch (e) {
      return withError({ message: e });
    }
  }
}

export default createHandler(OrderHandler);
