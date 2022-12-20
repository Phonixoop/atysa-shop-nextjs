import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import { Order } from "@prisma/client";
import { withError, withSuccess } from "helpers/index";

import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
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
  Delete,
  Header,
  SetHeader,
} from "next-api-decorators";

import { NextAuthGuard } from "server";
import request from "api";
import moment from "jalali-moment";

// constants
const OPTIME_USERNAME = process.env.OPTIME_API_USERNAME;
const OPTIME_PASSWORD = process.env.OPTIME_API_PASSWORD;
const OPTIME_API_BASE_URL = process.env.OPTIME_API_BASE_URL;

const OPTIME_SIGNIN_URL = OPTIME_API_BASE_URL + "/api/auth/SignIn";
const OPTIME_NEW_PLAN_URL = OPTIME_API_BASE_URL + "/api/planning/NewPlan";
const OPTIME_NEW_PIN_URL =
  OPTIME_API_BASE_URL + "/api/planService/AddNewPinToPlan";

// class OptimeHandler {
//   @Post("")
//   async createPin(
//     @Body()
//     body: {
//       order: {
//         id: string;
//         address: {
//           title: string;
//           description: string;
//           location: { lat: number; lon: number };
//           isActive: boolean;
//         };
//         customerName: string;
//         customerPhoneNumber: string;
//       };
//     }
//   ) {
//     //
//     const response = await request({
//       fullUrl: OPTIME_SIGNIN_URL,
//       method: "POST",
//       body: {
//         userName: OPTIME_USERNAME,
//         password: OPTIME_PASSWORD,
//         rememberMe: true,
//       },
//     });

//     if (response.status !== 200) return withError({ message: response });

//     const accessToken = response.accessToken;
//     const lastOptimePlan = await prisma.optimePlan.findFirst({
//       orderBy: {
//         created_at: "desc",
//       },
//     });
//     console.log({ lastOptimePlan });

//     const shouldCreateNewPlan = lastOptimePlan
//       ? moment().isAfter(moment(lastOptimePlan.created_at))
//       : true;

//     const plan = shouldCreateNewPlan
//       ? await createNewPlan({
//           name:
//             " برنامه غذای رژیمی  " +
//             moment().locale("fa").format("D MMMM").toString(),
//           token: accessToken,
//         })
//       : lastOptimePlan;

//     const pin = await createNewPin({
//       token: accessToken,
//       planToken: plan.plan_token,
//       pin: {
//         Id: body.order.id,
//         Address: body.order.address.description,
//         Latitude: body.order.address.location.lat,
//         Longitude: body.order.address.location.lon,
//         CustomerName: body.order.customerName,
//         CustomerPhoneNumber: body.order.customerPhoneNumber,
//       },
//     });

//     return pin;
//   }
// }

export async function createPin(body: {
  order: {
    id: string;
    address: {
      description: string;
      location: { lat: number; lon: number };
    };
    customerName: string;
    customerPhoneNumber: string;
  };
}) {
  //
  const response = await request({
    fullUrl: OPTIME_SIGNIN_URL,
    method: "POST",
    body: {
      userName: OPTIME_USERNAME,
      password: OPTIME_PASSWORD,
      rememberMe: true,
    },
  });

  if (response.status !== 200) return withError({ message: response });

  const accessToken = response.accessToken;
  const lastOptimePlan = await prisma.optimePlan.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });

  const shouldCreateNewPlan = lastOptimePlan
    ? moment().isAfter(moment(lastOptimePlan.created_at))
    : true;

  const plan = shouldCreateNewPlan
    ? await createNewPlan({
        token: accessToken,
        name:
          " برنامه غذای رژیمی  " +
          moment().locale("fa").format("D MMMM").toString(),
      })
    : lastOptimePlan;

  const pin = await createNewPin({
    token: accessToken,
    planToken: plan.plan_token,
    pin: {
      Id: body.order.id,
      Address: body.order.address.description,
      Latitude: body.order.address.location.lat,
      Longitude: body.order.address.location.lon,
      CustomerName: body.order.customerName,
      CustomerPhoneNumber: body.order.customerPhoneNumber,
    },
  });

  return pin;
}

interface PlanResponse {
  token: string;
  message: string;
  status: number;
  responseDateTime: Date;
}
async function createNewPlan({
  token = "",
  name = "",
}: {
  name: string;
  token: string;
}) {
  const response = await request({
    fullUrl: OPTIME_NEW_PLAN_URL,
    method: "POST",
    headers: {
      Authorization: "bearer " + token,
    },
    body: {
      fileContent: [{}],
      fileExtention: "json",
      planName: name,
      owner: "shop.atysa.ir",
      description: "string",
      toolName: "FULL_REVERSE_LOGISTIC",
      planConfigDto: {
        config: [
          {
            out: "10",
            name: "car",
            type: "car",
            zone: "0",
            volume: 0,
            weight: 0,
          },
        ],
        option: [
          {
            shiftsCode: ["8-22"],
          },
        ],
      },
    },
  });

  if (!response.token) return undefined;

  const plan = await prisma.optimePlan.create({
    data: {
      plan_token: response.token,
    },
  });

  return plan;
}

async function createNewPin({ token = "", planToken = "", pin }) {
  const response = await request({
    fullUrl: OPTIME_NEW_PIN_URL,
    method: "POST",
    headers: {
      Authorization: "bearer " + token,
    },
    body: {
      planIdOrToken: planToken,
      newPins: [
        {
          ...pin,
        },
      ],
    },
  });

  return response;
}

// export default createHandler(OptimeHandler);
