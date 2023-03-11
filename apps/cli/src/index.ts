#! /usr/bin/env node
import puppeteer from "puppeteer";
import ora from "ora";
import { PKG_ROOT } from "./consts.js";
import path from "path";
import fs from "fs-extra";
import os from "os";
import { execa } from "execa";
import portfinder from "portfinder";

const commandSpinner = ora("Starting the UI...").start();

try {
  const webCloneDir = path.join(os.tmpdir(), "t3-ui/web");
  const webDir = path.join(PKG_ROOT, "../web/out");

  fs.copySync(webDir, webCloneDir);

  const port = await portfinder.getPortPromise();

  const serveCommand = execa("npx", ["http-server", `--port=${port}`], {
    cwd: webCloneDir,
  });

  await new Promise<void>((res, rej) => {
    serveCommand.stdout?.on("data", async (data: Buffer) => {
      const str = data.toString();

      if (str.includes("Available on:")) {
        const browser = await puppeteer.launch({
          headless: false,
          defaultViewport: null,
          args: ["--start-maximized"],
          ignoreDefaultArgs: ["--enable-automation"],
        });
        const page = await browser.newPage();

        await page.goto(`http://localhost:${port}`);
        commandSpinner.succeed("UI started!");
      }
    });
  });
} catch (e) {
  commandSpinner.fail("Could not start the UI!");
}

export {};
