import { projectMetaSchema } from "~/pages/turbo";
import { createTRPCRouter, publicProcedure } from "../trpc";
import path from "path";
import { execaCommand } from "execa";
import { getWorkingDir } from "~/utils/get-user-data";
import { z } from "zod";
import { turboChromeExtensionPlugin } from "~/plugins/internal";

export const projectRouter = createTRPCRouter({
  createTurbo: publicProcedure
    .input(
      projectMetaSchema.extend({
        additionalTemplates: z.array(z.enum(["chrome"])),
      })
    )
    .mutation(async ({ input }) => {
      const projectPath = path.join(getWorkingDir(), input.name);

      await execaCommand(
        `git clone https://github.com/t3-oss/create-t3-turbo.git ${projectPath}`,
        { cwd: getWorkingDir() }
      );

      if (input.additionalTemplates.includes("chrome")) {
        turboChromeExtensionPlugin(input.name, {}).apply();
      }

      await execaCommand(`${input.packageManager} install`, {
        cwd: projectPath,
      });
    }),
});
