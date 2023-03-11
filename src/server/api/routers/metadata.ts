import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const metadataRouter = createTRPCRouter({
  getCurrentDirectory: publicProcedure.query(() => {
    return process.cwd();
  }),
});
