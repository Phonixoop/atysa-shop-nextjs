import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import { OrderStatus } from "@prisma/client";

import { createPin, createNewPin } from "pages/api/optime";

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
  Res,
} from "next-api-decorators";
import { withError, withSuccess } from "helpers/index";

import { NextAuthGuard } from "server/common";
import { jsonify } from "utils/index";
import moment from "jalali-moment";
import { NextResponse } from "next/server";
import { zarinpal } from "server/common/zarinpal";

declare module "next" {
  interface NextApiRequest {
    user?: User;
  }
}

// Helper
const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

// Turn enum into array
// function ToArray(enumme) {
//   return Object.keys(enumme)
//     .filter(StringIsNumber)
//     .map((key) => enumme[key]);
// }

const OrderStatusArray = Object.values(OrderStatus) as OrderStatus[];

@NextAuthGuard()
class OrderHandler {
  @Get("/hi")
  async getMe(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
    const response = await zarinpal.PaymentRequest({
      Amount: "1000", // In Tomans
      CallbackURL: "http://localhost:3000/pay/zarinpal/validate",
      Description: "A Payment from Node.JS",
      Email: "hi@siamak.work",
      Mobile: "09120000000",
    });
    console.log({ response });
    res.redirect(response.url);
    return JSON.stringify(response);
  }

  @Get()
  async orders(
    @Req() req: NextApiRequest,
    @Query("cursor") cursor?: string,
    @Query("orderStatuses", DefaultValuePipe(OrderStatusArray.join(",")))
    orderStatuses?: string,
    @Query("limit", DefaultValuePipe(2), ParseNumberPipe({ nullable: true }))
    limit?: number
  ) {
    if (orderStatuses?.split(",").includes("ALL"))
      orderStatuses = OrderStatusArray.join(",");
    if (!orderStatuses) return;
    let result: any = {
      error: true,
      message: "",
      data: {},
    };

    const orders: any = await prisma.order.findMany({
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

    return result;
  }

  @Post()
  async createOrder(
    @Req() req: NextApiRequest,
    @Res() res: NextApiResponse,
    @Body() body: any
  ) {
    try {
      const {
        basket_items,
        tax,
        has_coupon,
        coupon_code,
        coupon_discount,
        total_price,
        deliver_datetime_string,
        deliver_date_string,
        deliver_datetime,
      } = body;

      if (!req.user?.addresses.find((a) => a.isActive === true))
        return withError({ message: "no active address" });

      try {
        const response = await zarinpal.PaymentRequest({
          Amount: "1000", // In Tomans
          CallbackURL: process.env.BASE_URL + "/pay/zarinpal/validate",
          Description: "A Payment from Node.JS",
          Email: "hi@siamak.work",
          Mobile: "09120000000",
        });

        const order = await prisma.order.create({
          data: {
            basket_items,
            tax,
            has_coupon,
            coupon_code,
            coupon_discount,
            total_price,
            deliver_datetime_string,
            authority: response.authority,
            deliver_date_string,
            deliver_datetime,
            address: req.user.addresses.find((a) => a.isActive === true) || {},
            user: {
              connect: {
                phonenumber: req.user.phonenumber,
              },
            },
            status: "PURCHASED_AND_PENDING",
          },
        });

        return res.send({
          redirectUrl: response.url,
        });
      } catch {}
    } catch (e: any) {
      //  console.log(e);
      return withError({ message: "" });
    }
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
    if (!req.user) return;
    // user only can change order status to USER_REJECTED
    // console.log(req.user.role);
    if (
      req.user.role === "USER" &&
      (body.orderStatus as OrderStatus) !== "USER_REJECTED"
    )
      throw new ForbiddenException(
        "user only can change order status to USER_REJECTED"
      );

    // admin can do anything, da! , obviously

    try {
      const singleOrder = await prisma.order.findUnique({ where: { id } });
      if (!singleOrder) return;
      if (
        req.user.role === "USER" &&
        singleOrder.status !== "PURCHASED_AND_PENDING"
      )
        throw new ForbiddenException(
          "user can only reject the order when order status is PURCHASED_AND_PENDING "
        );
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

      const user = await prisma.user.findUnique({
        where: { id: order.user_id },
      });
      if (!user) return;

      if (order.status === "ACCEPTED") {
        const orderDescription = order.basket_items
          .map((item) => {
            return jsonify(item.product).name + " " + item.quantity;
          })
          .join("\n");

        const pin = await createPin({
          order: {
            id: order.id,
            orderDescription,
            address: {
              description: order.address.description,
              location: order.address.location,
            },
            deliver_date_string: order.deliver_date_string,
            customerName: user?.first_name + " " + user?.last_name,
            customerPhoneNumber: user.phonenumber,
            CustomerTimeWindow:
              moment(order.deliver_datetime.start).format("HH:00") +
              "-" +
              moment(order.deliver_datetime.end).format("HH:00"),
          },
        });

        return withSuccess({ data: order, message: pin.result });
      }
      return withSuccess({ data: order });
    } catch (e: any) {
      return withError({ message: e });
    }
  }
}

interface ZarinPalRequest {
  status: number;
  authority: string;
  url: string;
}
async function zarinPalRequest(): Promise<ZarinPalRequest> {
  return new Promise((resolve, reject) => {
    zarinpal
      .PaymentRequest({
        Amount: "1000", // In Tomans
        CallbackURL: "https://your-safe-api/example/zarinpal/validate",
        Description: "A Payment from Node.JS",
        Email: "hi@siamak.work",
        Mobile: "09120000000",
      })
      .then((response) => {
        console.log({ response });
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default createHandler(OrderHandler);
