import { authRouter } from "./auth-router.js";
import { grantRouter } from "./grant-router.js";
import { applicationRouter } from "./application-router.js";
import { adminRouter } from "./admin-router.js";
import { contactRouter } from "./contact-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  grant: grantRouter,
  application: applicationRouter,
  admin: adminRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
