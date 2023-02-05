import { commentRouter } from "server/trpc/router/comment";
import { router } from "../trpc";
import { authRouter } from "./auth";
import { materialRouter } from "./material";
import { userRouter } from "./user";
import { couponRouter } from "server/trpc/router/coupon";

export const appRouter = router({
  user: userRouter,
  material: materialRouter,
  auth: authRouter,
  comment: commentRouter,
  coupon: couponRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
