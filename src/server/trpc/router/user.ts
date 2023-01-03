import { User } from "@prisma/client";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  getUser: publicProcedure.query(({ ctx }) => {
    return ctx.session;
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
            },
          },
        },
      });
    }),
});
