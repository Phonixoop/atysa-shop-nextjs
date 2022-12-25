import { getToken } from "next-auth/jwt";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@prisma/client";
import type { Material } from "@prisma/client";

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
} from "next-api-decorators";
import { withError, withSuccess } from "helpers/index";

import { NextAuthGuard } from "server";
import { jsonify } from "utils/index";

@NextAuthGuard()
class MaterialHandler {
  @Put()
  async upsertMaterial(
    @Body()
    body: Material
  ) {
    await prisma.material.upsert({
      where: {
        id: body?.id || "",
      },
      create: {
        ...body,
      },
      update: {
        ...body,
      },
    });
  }
}

export default createHandler(MaterialHandler);
