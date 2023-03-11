#! /usr/bin/env node
import { execa } from "execa";
import open from "open";
import ora from "ora";
const serverSpinner = ora("Launching UI...").start();
try {
    const server = execa("npm", ["start"]);
    await new Promise(async (res, rej) => {
        server.stdout?.on("data", async (data) => {
            const str = data.toString();
            if (str.includes("ready - started server")) {
                const pageUrl = str.split("url: ").pop()?.trim() ?? "";
                await open(pageUrl);
                serverSpinner.succeed("UI has been launched!");
            }
        });
    });
}
catch (e) {
    serverSpinner.fail("Failed to launch UI!");
}
