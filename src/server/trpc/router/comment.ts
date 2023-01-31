import { User } from "@prisma/client";
import { DAYS } from "data";
import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const commentRouter = router({
  getInfiniteComments: publicProcedure
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
        (await ctx.prisma.comment.findMany({
          take: limit + 1, // get an extra item at the end which we'll use as next cursor
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            created_at: "asc",
          },
          include: {
            order: true,
            user: true,
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
  getCommentsByProductId: publicProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.comment.findMany({
        take: 10,
        include: {
          order: true,
          user: true,
        },
      });
      const comments = result
        ?.filter((comment) => {
          if (
            comment.order.basket_items
              .map((item) => item.product)
              //@ts-ignore
              .some((a) => a.id === input.productId) &&
            comment.isAccepted
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
            //@ts-ignore
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
      await ctx.prisma.comment.create({
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

      // const result = await ctx.prisma?.order.findFirst({
      //   where: { id: input.order_id },
      //   select: {
      //     basket_items: true,
      //   },
      // });

      // const products = result?.basket_items.map((a) => a.product);

      // products?.map(async (product) => {
      //   const product = await ctx.prisma?.product.findFirst({
      //     where: {
      //       id: product.id,
      //     },
      //   });
      //   const product = await ctx.prisma?.product.update({
      //     where: {
      //       id: product.id,
      //     },
      //     data :{
      //       rate_score :
      //     }
      //   });
      // });
    }),
  updateCommentAcception: publicProcedure
    .input(z.object({ commentId: z.string(), accept: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.comment.update({
        where: {
          id: input.commentId,
        },
        data: {
          isAccepted: input.accept,
        },
      });
    }),
});
