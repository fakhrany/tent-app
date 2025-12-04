import { createTRPCRouter } from "./trpc";
import { chatRouter } from "./routers/chat";
import { adminRouter } from "./routers/admin";
import { analyticsRouter } from "./routers/analytics";

export const appRouter = createTRPCRouter({
  chat: chatRouter,
  admin: adminRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
