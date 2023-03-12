import { projectMetaSchema } from "~/pages/turbo";
import { createTRPCRouter, publicProcedure } from "../trpc";
import path from "path";
import { execaCommand } from "execa";
import { getWorkingDir } from "~/utils/get-user-data";
import { z } from "zod";
import { turboChromeExtensionPlugin } from "~/plugins/internal";
import { TurboActivePlugins, TURBO_PLUGINS } from "~/plugins/public";

export const projectRouter = createTRPCRouter({
  createTurbo: publicProcedure
    .input(
      projectMetaSchema.extend({
        additionalTemplates: z.array(z.enum(["chrome"])),
        plugins: z.array(
          z.object({
            pluginId: z.enum([TurboActivePlugins.TurboSetupEnvFile]),
            data: z.unknown(),
          })
        ),
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

      new Array(...new Set(input.plugins)).forEach((plugin) => {
        TURBO_PLUGINS[plugin.pluginId].plugin(input.name, plugin.data).apply();
      });

      await execaCommand(`${input.packageManager} install`, {
        cwd: projectPath,
      });
    }),
});
