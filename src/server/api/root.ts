import { createTRPCRouter } from "~/server/api/trpc";
import { metadataRouter } from "./routers/metadata";
import { pluginRouter } from "./routers/plugin";
import { projectRouter } from "./routers/project";

export const appRouter = createTRPCRouter({
  metadata: metadataRouter,
  project: projectRouter,
  plugin: pluginRouter,
});

export type AppRouter = typeof appRouter;
