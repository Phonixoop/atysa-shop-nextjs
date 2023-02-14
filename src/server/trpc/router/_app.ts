import { router } from "../trpc";
import { commentRouter } from "server/trpc/router/comment";
import { authRouter } from "./auth";
import { materialRouter } from "./material";
import { userRouter } from "./user";
import { couponRouter } from "server/trpc/router/coupon";
import { productRouter } from "server/trpc/router/product";
import { settingsRouter } from "server/trpc/router/settings";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  material: materialRouter,
  product: productRouter,
  comment: commentRouter,
  coupon: couponRouter,
  settings: settingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
