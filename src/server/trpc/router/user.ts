import { User } from "@prisma/client";
import { DAYS } from "data";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getCustomProducts: publicProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user as User;
    if (!user) return;

    const result = await ctx.prisma.user.findFirst({
      where: { phonenumber: user.phonenumber },
    });
    return result?.custom_products;
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
});
