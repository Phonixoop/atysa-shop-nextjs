import { commentRouter } from "server/trpc/router/comment";
import { router } from "../trpc";
import { authRouter } from "./auth";
import { materialRouter } from "./material";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  material: materialRouter,
  auth: authRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
