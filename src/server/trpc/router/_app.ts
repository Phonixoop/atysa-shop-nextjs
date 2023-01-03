import { router } from "../trpc";
import { authRouter } from "./auth";
import { materialRouter } from "./material";

export const appRouter = router({
  material: materialRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
