import { User } from "@prisma/client";
import { DAYS } from "data";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getInfiniteUsers: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items =
        (await ctx.prisma.user.findMany({
          take: limit + 1, // get an extra item at the end which we'll use as next cursor
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            created_at: "asc",
          },
        })) || [];
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }
      return {
        items,
        nextCursor,
      };
    }),
  getCustomProducts: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user as User;
    if (!user) return;

    const result = await ctx.prisma.user.findFirst({
      where: { phonenumber: user.phonenumber },
    });
    return result?.custom_products.reverse();
  }),
  getSingleProduct: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.session?.user as User;
      if (!user) return;

      const result = await ctx.prisma.user.findFirst({
        where: {
          phonenumber: user.phonenumber,
        },
      });
      return result?.custom_products.find((product) => product.id === input.id);
    }),
  addCustomProduct: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullish(),
        calories: z.number(),
        price: z.number(),
        ingredients: z.array(
          z.object({
            name: z.string(),
            calories: z.number(),
            price: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user as User;
      if (!user) return;
      return await ctx.prisma.user.update({
        where: { phonenumber: user.phonenumber || "" },
        data: {
          custom_products: {
            push: {
              name: input.name,
              description: input.description,
              calories: input.calories,
              price: input.price,
              ingredients: input.ingredients,
              deliver_period: {
                availableDaysOfWeek: [...Object.keys(DAYS)],
                delay: 48,
                timePeriod: {
                  startHour: undefined,
                  endHour: undefined,
                },
              },
            },
          },
        },
      });
    }),
  deleteCustomProduct: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user as User;
      if (!user) return;
      return await ctx.prisma.user.update({
        where: { phonenumber: user.phonenumber || "" },
        data: {
          custom_products: {
            deleteMany: {
              where: {
                id: input.id,
              },
            },
          },
        },
      });
    }),
  updateUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        first_name: z.string().nullable(),
        last_name: z.string().nullable(),
        role: z.enum(["ADMIN", "USER"]),
        gender: z.enum(["MALE", "FEMALE", "OTHER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user as User;
      if (!user) return;
      return await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          first_name: input.first_name,
          last_name: input.last_name,
          gender: input.gender,
          role: input.role,
        },
      });
    }),
});
