#! /usr/bin/env node
import puppeteer, { ElementHandle } from "puppeteer";
import ora from "ora";
import { PKG_ROOT } from "./consts.js";
import path from "path";
import fs from "fs-extra";
import os from "os";
import { execa } from "execa";
import portfinder from "portfinder";
import { z } from "zod";

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
        });

        const pages = await browser.pages();
        const page = pages[0];

        await page.goto(`http://localhost:${port}`);

        page.evaluate((cwd) => {
          localStorage.setItem("__T3_UI_DIR__", cwd);
        }, process.cwd());

        commandSpinner.succeed("UI started!");

        await page.waitForSelector("#doneDataElement", {
          timeout: 0,
        });

        const installSpinner = ora("Installing your project...").start();

        const element = (await page.$(
          "#doneDataElement"
        )) as ElementHandle<HTMLDivElement>;

        const value = JSON.parse(
          (await page.evaluate((el) => {
            const rawText = el.textContent;
            localStorage.clear();
            return rawText;
          }, element)) || "{}"
        );

        const properValue = z
          .object({
            name: z
              .string()
              .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
                message:
                  "Name should only contain lowercase characters and dashes",
              })
              .min(1),
            appType: z.enum(["APP", "TURBO"]),
          })
          .safeParse(value);

        if (!properValue.success) {
          installSpinner.fail("Invalid input data!");
          process.exit(1);
        }

        const { name, appType } = properValue.data;

        await new Promise<void>((res, rej) => {
          setTimeout(() => {
            res();
          }, 10_000);
        });

        page.goto(`http://localhost:${port}/done`);

        installSpinner.succeed(`Project "${name}" installed!`);
      }
    });
  });
} catch (e) {
  commandSpinner.fail("Could not start the UI!");
}

export {};
