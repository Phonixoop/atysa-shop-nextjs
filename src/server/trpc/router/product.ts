import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const productRouter = router({
  searchProduct: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.product.findMany({
        where: {
          name: {
            contains: input.name.toLowerCase(),
          },
        },
      });
    }),
});
