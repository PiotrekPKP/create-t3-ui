import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getWorkingDir } from "~/utils/get-user-data";

export const metadataRouter = createTRPCRouter({
  getCurrentDirectory: publicProcedure.query(() => {
    return getWorkingDir();
  }),
});
