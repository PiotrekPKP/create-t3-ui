#! /usr/bin/env node
import { execa } from "execa";
import ora from "ora";

const CWD = `${process.cwd()}/apps/web`;

try {
  const command = execa("npm", ["start"], { cwd: CWD });

  const commandSpinner = ora("Starting the UI...").start();

  await new Promise<void>((res, rej) => {
    command.stdout?.on("data", (data: Buffer) => {
      const str = data.toString();

      if (str.includes("ready - started")) {
        commandSpinner.succeed("UI started!");
      }
    });
    command.on("error", (e) => rej(e));
    command.on("close", () => res());
  });
} catch (e) {
  console.log("Could not run the UI...", e);
}

export {};
