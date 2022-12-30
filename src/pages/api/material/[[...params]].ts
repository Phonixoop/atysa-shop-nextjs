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
  Delete,
} from "next-api-decorators";
import { withError, withSuccess } from "helpers/index";

import { NextAuthGuard } from "server";
import { jsonify } from "utils/index";

@NextAuthGuard()
class MaterialHandler {
  @Get()
  async getMaterials() {
    return await prisma.material.findMany({});
  }
  @Get("/:id")
  async getMaterialById(@Param("id") id: string) {
    try {
      return await prisma.material.findFirst({
        where: {
          id,
        },
      });
    } catch {
      return {};
    }
  }
  @Put()
  async upsertMaterial(
    @Body()
    body: Material
  ) {
    const material = await prisma.material.upsert({
      where: {
        id: body?.id || "63711d7753107227a4188724",
      },
      create: {
        name: body.name,
        min_choose: body.min_choose,
        max_choose: body.max_choose,
        image_url: body.image_url,
        ingredients: body.ingredients,
      },
      update: {
        name: body.name,
        min_choose: body.min_choose,
        max_choose: body.max_choose,
        image_url: body.image_url,
        ingredients: body.ingredients,
      },
    });

    return material;
  }

  @Delete("/:id")
  async deleteMaterial(@Param("id") id: string) {
    const material = await prisma.material.delete({
      where: {
        id,
      },
    });

    return material;
  }
}

export default createHandler(MaterialHandler);
