import { projectMetaSchemaTurbo } from "~/pages/turbo";
import { projectMetaSchemaApp } from "~/pages/app";
import { createTRPCRouter, publicProcedure } from "../trpc";
import path from "path";
import { execaCommand } from "execa";
import { getWorkingDir } from "~/utils/get-user-data";
import { z } from "zod";
import { turboChromeExtensionPlugin } from "~/plugins/internal";
import {
  AppActivePlugins,
  APP_PLUGINS,
  TurboActivePlugins,
  TURBO_PLUGINS,
} from "~/plugins/public";

export const projectRouter = createTRPCRouter({
  createTurbo: publicProcedure
    .input(
      projectMetaSchemaTurbo.extend({
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
  createApp: publicProcedure
    .input(
      projectMetaSchemaApp.extend({
        extensions: z.array(z.enum(["trpc", "prisma", "nextAuth", "tailwind"])),
        plugins: z.array(
          z.object({
            pluginId: z.enum([AppActivePlugins.AppSetupEnvFile]),
            data: z.unknown(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const projectPath = path.join(getWorkingDir(), input.name);

      const flags = new Array(...new Set(input.extensions))
        .map((e) => "--" + e)
        .join(" ");

      switch (input.packageManager) {
        case "npm":
          await execaCommand(
            `npx create-t3-app@latest --CI ${flags} ${projectPath}`,
            { cwd: getWorkingDir() }
          );
          break;
        case "pnpm":
          await execaCommand(
            `pnpx create-t3-app@latest --CI ${flags} ${projectPath}`,
            { cwd: getWorkingDir() }
          );
          break;
        case "yarn":
          await execaCommand(
            `yarn create t3-app --CI ${flags} ${projectPath}`,
            { cwd: getWorkingDir() }
          );
          break;
      }

      new Array(...new Set(input.plugins)).forEach((plugin) => {
        APP_PLUGINS[plugin.pluginId].plugin(input.name, plugin.data).apply();
      });

      await execaCommand(`${input.packageManager} install`, {
        cwd: projectPath,
      });
    }),
});
