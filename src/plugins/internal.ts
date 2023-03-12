import { createPlugin } from ".";

export const turboChromeExtensionPlugin = createPlugin(() => ({
  id: "turbo-chrome-extension",
  name: "Chrome Extension with Plasmo",
  description: "Adds Chrome Extension template with Plasmo",
  copyDirs: [
    { from: "plugins/turbo-chrome-extension/chrome", to: "apps/chrome" },
  ],
  addLines: [
    { file: ".env.example", lines: ["NEXT_PUBLIC_EXTENSION_ID="] },
    { file: ".gitignore", lines: [".plasmo"] },
  ],
  replaceInFiles: [
    {
      file: "apps/nextjs/src/env.mjs",
      from: "// NEXT_PUBLIC_CLIENTVAR: z.string().min(1),",
      to: "NEXT_PUBLIC_EXTENSION_ID: z.string(),",
    },
    {
      file: "pnpm-workspace.yaml",
      from: "apps/expo",
      to: "apps/expo\n  - apps/chrome",
    },
  ],
  copyFiles: [
    {
      from: "plugins/turbo-chrome-extension/ext-auth-signin.tsx",
      to: "apps/nextjs/src/pages/ext-auth/signin.tsx",
    },
    {
      from: "plugins/turbo-chrome-extension/ext-auth-signout.tsx",
      to: "apps/nextjs/src/pages/ext-auth/signout.tsx",
    },
  ],
}));
