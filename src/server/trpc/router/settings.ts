import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const settingsRouter = router({
  getSettings: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.settings.findFirst();
  }),
  setSettings: publicProcedure
    .input(
      z.object({
        id: z.string(),
        deliver_price: z.number().nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.settings.upsert({
        where: {
          id: input.id || "6370ebf8b06cb5186e4df080",
        },
        create: {
          delivery_price: input.deliver_price,
        },
        update: {
          delivery_price: input.deliver_price,
        },
      });
    }),
});
