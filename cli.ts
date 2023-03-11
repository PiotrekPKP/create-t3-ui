#! /usr/bin/env node
import { execa, execaCommand } from "execa";
import open from "open";
import ora from "ora";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
const PKG_ROOT = path.join(distPath, "../");

const serverSpinner = ora("Launching UI...").start();

try {
  const server = execaCommand("npm start", {
    cwd: PKG_ROOT,
    env: { NODE_ENV: process.env.NODE_ENV, USER_DIR: process.cwd(), PKG_ROOT },
  });

  await new Promise<void>((res, rej) => {
    server.stdout?.on("data", async (data: Buffer) => {
      const str = data.toString();

      if (str.includes("ready - started server")) {
        const pageUrl = str.split("url: ").pop()?.trim() ?? "";

        await open(pageUrl);

        serverSpinner.succeed("UI has been launched!");
      }
    });

    server.on("error", (e) => rej(e));
    server.on("close", () => res());
  });
} catch (e) {
  serverSpinner.fail("Failed to launch UI!");
}
