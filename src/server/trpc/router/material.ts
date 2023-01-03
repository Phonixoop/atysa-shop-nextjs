import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const materialRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.material.findMany({});
  }),
});
