import { projectMetaSchema } from "~/pages/turbo";
import { createTRPCRouter, publicProcedure } from "../trpc";
import path from "path";
import { execaCommand } from "execa";

export const projectRouter = createTRPCRouter({
  create: publicProcedure
    .input(projectMetaSchema)
    .mutation(async ({ input }) => {
      const projectPath = path.join(process.cwd(), input.name);

      await execaCommand(
        `git clone https://github.com/t3-oss/create-t3-turbo.git ${projectPath}`,
        { cwd: process.cwd() }
      );

      const pkgManager = "pnpm";

      await execaCommand(`${pkgManager} install`, { cwd: projectPath });
    }),
});
