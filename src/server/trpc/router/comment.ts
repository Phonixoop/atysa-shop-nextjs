import { User } from "@prisma/client";
import { DAYS } from "data";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const commentRouter = router({
  getCommentsByProductId: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log(input.productId);

      const result = await prisma?.comment.findMany({
        take: 10,
        include: {
          order: true,
          user: true,
        },
      });
      const comments = result
        ?.filter((element) => {
          if (
            element.order.basket_items
              .map((item) => item.product)
              .some((a) => a.id === input.productId)
          )
            return true;
          return false;
        })
        .map((item) => {
          return {
            id: item.id,
            message: item.message,
            rate_score: item.rate_score,
            user_name: item.user.first_name + " " + item.user.last_name,
            admin_reply: item.admin_reply,
            products: item.order.basket_items.map((a) => a.product.name),
            created_at: item.created_at,
          };
        });
      return comments;
    }),
  addCommentAndRateScore: publicProcedure
    .input(
      z.object({
        order_id: z.string(),
        message: z.string(),
        rate_score: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session?.user as User;
      if (!user) return;
      await prisma?.comment.create({
        data: {
          message: input.message,
          rate_score: input.rate_score,
          order: {
            connect: {
              id: input.order_id,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      // const result = await prisma?.order.findFirst({
      //   where: { id: input.order_id },
      //   select: {
      //     basket_items: true,
      //   },
      // });

      // const products = result?.basket_items.map((a) => a.product);

      // products?.map(async (product) => {
      //   const product = await prisma?.product.findFirst({
      //     where: {
      //       id: product.id,
      //     },
      //   });
      //   const product = await prisma?.product.update({
      //     where: {
      //       id: product.id,
      //     },
      //     data :{
      //       rate_score :
      //     }
      //   });
      // });
    }),
});
