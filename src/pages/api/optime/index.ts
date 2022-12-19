import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import { OrderStatus } from "@prisma/client";
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
const OPTIME_NEWPLAN_URL = OPTIME_API_BASE_URL + "/api/planning/NewPlan";

class OptimeHandler {
  @Get("")
  async createPin() {
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
    // const lastOptimePlan = await prisma.optimePlan.findFirst({
    //   orderBy: {
    //     created_at: "desc",
    //   },
    // });

    // const shouldCreateNewPlan = moment().isAfter(
    //   moment(lastOptimePlan.created_at)
    // );

    const plan = await createNewPlan({
      name:
        " برنامه غذای رژیمی  " +
        moment().locale("fa").format("D MMMM").toString(),
      token: response.accessToken,
    });
    console.log("hi", plan);
    console.log({ plan });
    return plan;
  }
}

async function createNewPlan({
  name = "",
  token = "",
}: {
  name: string;
  token: string;
}) {
  const response = await request({
    fullUrl: OPTIME_NEWPLAN_URL,
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
  return response;
}

export default createHandler(OptimeHandler);
