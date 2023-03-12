import { TURBO_PLUGINS } from "~/plugins/public";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const pluginRouter = createTRPCRouter({
  getTurboPlugins: publicProcedure.query(() => {
    return Object.entries(TURBO_PLUGINS).map(([key, value]) => ({
      name: value.name,
      description: value.description,
      id: key,
    }));
  }),
});
