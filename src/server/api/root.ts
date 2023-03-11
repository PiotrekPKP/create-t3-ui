import { createTRPCRouter } from "~/server/api/trpc";
import { metadataRouter } from "./routers/metadata";
import { projectRouter } from "./routers/project";

export const appRouter = createTRPCRouter({
  metadata: metadataRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
