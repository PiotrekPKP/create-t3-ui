import { env } from "~/env.mjs";

export const getWorkingDir = () => env.USER_DIR;

export type PackageManager = "npm" | "pnpm" | "yarn";

// Used from https://github.com/t3-oss/create-t3-app
export const getPkgManager = (): PackageManager => {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith("yarn")) {
      return "yarn";
    } else if (userAgent.startsWith("pnpm")) {
      return "pnpm";
    } else {
      return "npm";
    }
  } else {
    return "npm";
  }
};
