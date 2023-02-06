import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import moment, { now } from "jalali-moment";

const idArrayNullable = z
  .array(
    z.object({
      id: z.string(),
    })
  )
  .nullish();
export const createCouponOTP = z.object({
  name: z.string(),
  remainder_count: z.number().default(0),
  status: z.enum(["ACTIVATED", "DEACTIVATED"]).default("ACTIVATED"),
  discount_percentage: z.number(),
  expire_date: z.date(),
  users: idArrayNullable,
  categories: idArrayNullable,
  products: idArrayNullable,
});

export const editCouponOTP = z.object({
  id: z.string(),
  name: z.string(),
  remainder_count: z.number().default(0),
  status: z.enum(["ACTIVATED", "DEACTIVATED"]).default("ACTIVATED"),
  discount_percentage: z.number(),
  expire_date: z.date(),
  users: idArrayNullable,
  categories: idArrayNullable,
  products: idArrayNullable,
});
export const couponRouter = router({
  getInfiniteCoupons: publicProcedure
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
        (await ctx.prisma.coupon.findMany({
          take: limit + 1, // get an extra item at the end which we'll use as next cursor
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            created_at: "desc",
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
  addCoupon: publicProcedure
    .input(createCouponOTP)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.coupon.create({
        data: {
          name: input.name,
          status: "ACTIVATED",
          discount_percentage: input.discount_percentage,
          remainder_count: input.remainder_count,
          expire_date: input.expire_date,
          users: input.users
            ? {
                connect: [...(input.users || [])],
              }
            : undefined,
          categories: input.categories
            ? {
                connect: [...(input.categories || [])],
              }
            : undefined,
          products: input.products
            ? {
                connect: [...(input.products || [])],
              }
            : undefined,
        },
      });
    }),
  editCoupon: publicProcedure
    .input(editCouponOTP)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.coupon.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          status: "ACTIVATED",
          discount_percentage: input.discount_percentage,
          remainder_count: input.remainder_count,
          expire_date: input.expire_date,
          users: input.users
            ? {
                connect: [...(input.users || [])],
              }
            : undefined,
          categories: input.categories
            ? {
                connect: [...(input.categories || [])],
              }
            : undefined,
          products: input.products
            ? {
                connect: [...(input.products || [])],
              }
            : undefined,
        },
      });
    }),
  checkCoupon: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const coupon = await ctx.prisma.coupon.findUnique({
        where: {
          name: input.name,
        },
      });

      if (!coupon)
        return {
          isValid: false,
          message: "این کد تخفیف وجود ندارد",
        };
      if (coupon.remainder_count <= 0)
        return {
          isValid: false,
          message: "این کد تخفیف قبلا استفاده شده است",
        };
      if (moment(coupon.expire_date).isBefore(now()))
        return {
          isValid: false,
          message: "این کد منقضی شده است",
        };
      return {
        data: { ...coupon },
        isValid: true,
        message: "کد تخفیف شما با موفقیت ثبت شد",
      };
    }),
  deleteCoupon: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.coupon.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
