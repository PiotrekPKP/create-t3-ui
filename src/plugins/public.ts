import { createPlugin } from ".";

export const turboSetupEnvFilePlugin = createPlugin(() => ({
  copyFiles: [{ from: ".env.example", to: ".env", internal: true }],
}));

export enum TurboActivePlugins {
  TurboSetupEnvFile = "turbo-setup-env-file",
}

export const TURBO_PLUGINS: Record<
  TurboActivePlugins,
  { name: string; description: string; plugin: ReturnType<typeof createPlugin> }
> = {
  [TurboActivePlugins.TurboSetupEnvFile]: {
    name: "Setup .env file",
    description:
      "Adds .env file to the project based on your .env.example file",
    plugin: turboSetupEnvFilePlugin,
  },
};
