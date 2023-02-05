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

import request from "api";

// constants
const OPTIME_USERNAME = process.env.OPTIME_API_USERNAME;
const OPTIME_PASSWORD = process.env.OPTIME_API_PASSWORD;
const OPTIME_API_BASE_URL = process.env.OPTIME_API_BASE_URL;

const OPTIME_SIGNIN_URL = OPTIME_API_BASE_URL + "/api/auth/SignIn";
const OPTIME_NEW_PLAN_URL = OPTIME_API_BASE_URL + "/api/planning/NewPlan";
const OPTIME_NEW_PIN_URL =
  OPTIME_API_BASE_URL + "/api/planService/AddNewPinToPlan";

const OPTIME_EXECUTE_TOOL_URL =
  OPTIME_API_BASE_URL + "/api/PlanService/ExecuteTool";

const OPTIME_SET_CONFIG_URL = OPTIME_API_BASE_URL + "/api/Planning/SetConfig";

const OPTIME_GET_PLANS_URL =
  OPTIME_API_BASE_URL +
  "/api/Planning/GetAllCurrentTenantPlan?pageNumber=1&pageSize=10&Sorting=&IsDeleted=false";
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
    orderDescription: string;
    address: {
      description: string;
      location: { lat: number; lon: number };
    };
    deliver_date_string: string;
    customerName: string;
    customerPhoneNumber: string;
    CustomerTimeWindow: string;
  };
}): Promise<{ message?: any; pin?: any; result?: any }> {
  //

  const result = {
    Request_OPTIME_SIGNIN_URL: false,
    Request_CreateNewPlan: false,
    Request_OPTIME_EXECUTE_TOOL_URL: false,
    LastOptimePlan_NotFound: false,
  };
  const response = await request({
    fullUrl: OPTIME_SIGNIN_URL,
    method: "POST",
    body: {
      userName: OPTIME_USERNAME,
      password: OPTIME_PASSWORD,
      rememberMe: true,
    },
  }).then((response) => {
    result.Request_OPTIME_SIGNIN_URL = true;
    return response;
  });

  if (response.status !== 200) return withError({ message: response });

  const accessToken = response.accessToken;

  const lastOptimePlan = await prisma.optimePlan.findFirst({
    where: {
      deliver_date_string: body.order.deliver_date_string,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  // moment().isBefore(moment(lastOptimePlan.created_at)) &&

  const shouldCreateNewPlan = !lastOptimePlan
    ? true
    : lastOptimePlan.deliver_date_string === body.order.deliver_date_string
    ? false
    : true;

  const newPin = {
    Id: body.order.id,
    Address: body.order.address.description,
    Latitude: body.order.address.location.lat.toString(),
    Longitude: body.order.address.location.lon.toString(),
    CustomerName: body.order.customerName,
    CustomerPhoneNumber: body.order.customerPhoneNumber,
    Description: body.order.orderDescription,
    CustomerTimeWindow: body.order.CustomerTimeWindow,
  };

  const plan = shouldCreateNewPlan
    ? await createNewPlan({
        token: accessToken,
        deliver_date_string: body.order.deliver_date_string,
        name: " برنامه غذای رژیمی  " + body.order.deliver_date_string,
        newPin,
      })
    : lastOptimePlan;

  if (plan) result.Request_CreateNewPlan = true;
  if (!lastOptimePlan) result.LastOptimePlan_NotFound = true;
  let pin = {};

  if (!shouldCreateNewPlan)
    pin = await createNewPin({
      token: accessToken,
      planToken: plan?.plan_token,
      pin: {
        ...newPin,
      },
    });

  try {
    const res = await request({
      fullUrl: OPTIME_EXECUTE_TOOL_URL,
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
      body: {
        planIdOrToken: plan?.plan_token,
      },
    });
    result.Request_OPTIME_EXECUTE_TOOL_URL = true;
  } catch (error) {}

  return { pin, result };
}

interface PlanResponse {
  token: string;
  message: string;
  status: number;
  responseDateTime: Date;
}
async function createNewPlan({
  token = "",
  deliver_date_string = "",
  name = "",
  newPin,
}) {
  const response = await request({
    fullUrl: OPTIME_NEW_PLAN_URL,
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: {
      fileContent: [{ ...newPin }],
      fileExtention: "json",
      planName: name,
      owner: "shop.atysa.ir",
      description: "string",
      toolName: "FULL_REVERSE_LOGISTIC",
      planConfigDto: {
        config: [
          {
            out: "1",
            name: "car",
            type: "car",
            zone: "0",
            volume: 1,
            weight: 1,
          },
        ],
        option: [
          {
            shiftsCode: ["8-22"],
          },
          {
            useGeoCode: "false",
          },
        ],
      },
    },
  });

  if (!response.token) return undefined;

  const plan = await prisma.optimePlan.create({
    data: {
      plan_token: response.token,
      deliver_date_string,
    },
  });

  return plan;
}

export async function createNewPin({ token = "", planToken = "", pin }) {
  try {
    const response = await request({
      fullUrl: "https://api2.optime-ai.com/api/planService/AddNewPinToPlan",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: {
        planIdOrToken: planToken,
        newPins: [{ ...pin }],
      },
    });
    return response;
  } catch (e) {}
  return {};
}

// export default createHandler(OptimeHandler);
