import { projectMetaSchema } from "~/pages/turbo";
import { createTRPCRouter, publicProcedure } from "../trpc";
import path from "path";
import { execaCommand } from "execa";
import { getWorkingDir } from "~/utils/get-user-data";

export const projectRouter = createTRPCRouter({
  createTurbo: publicProcedure
    .input(projectMetaSchema)
    .mutation(async ({ input }) => {
      const projectPath = path.join(getWorkingDir(), input.name);

      await execaCommand(
        `git clone https://github.com/t3-oss/create-t3-turbo.git ${projectPath}`,
        { cwd: getWorkingDir() }
      );

      await execaCommand(`pnpm install`, { cwd: projectPath });
    }),
});
