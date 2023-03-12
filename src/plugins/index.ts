import fs from "fs-extra";
import { env } from "~/env.mjs";
import path from "path";
import { getWorkingDir } from "~/utils/get-user-data";

type Plugin = {
  id: string;
  name: string;
  description: string;
  copyDirs?: { from: string; to: string }[];
  copyFiles?: { from: string; to: string }[];
  replaceFiles?: { from: string; to: string }[];
  addLines?: { file: string; lines: string[] }[];
  replaceInFiles?: { file: string; from: string; to: string }[];
};

export const createPlugin =
  <T extends object>(pluginFactory: (variables: T) => Plugin) =>
  (projectName: string, data: T) => {
    const projectPath = path.join(getWorkingDir(), projectName);

    return {
      apply: () => {
        const plugin = pluginFactory(data);

        (plugin.copyDirs || []).forEach((copyDir) => {
          fs.copySync(
            `${env.PKG_ROOT}${copyDir.from}`,
            `${projectPath}${copyDir.to}`
          );
        });

        (plugin.copyFiles || []).forEach((copyFile) => {
          fs.copyFileSync(
            `${env.PKG_ROOT}${copyFile.from}`,
            `${projectPath}${copyFile.to}`
          );
        });

        (plugin.replaceFiles || []).forEach((replaceFile) => {
          fs.writeFileSync(
            `${projectPath}${replaceFile.to}`,
            fs.readFileSync(`${env.PKG_ROOT}${replaceFile.from}`)
          );
        });

        (plugin.addLines || []).forEach((addLine) => {
          fs.writeFileSync(
            `${projectPath}${addLine.file}`,
            fs.readFileSync(`${env.PKG_ROOT}${addLine.file}`).toString() +
              addLine.lines.join("\n")
          );
        });

        (plugin.replaceInFiles || []).forEach((replaceInFile) => {
          fs.writeFileSync(
            `${projectPath}${replaceInFile.file}`,
            fs
              .readFileSync(`${env.PKG_ROOT}${replaceInFile.file}`)
              .toString()
              .replace(replaceInFile.from, replaceInFile.to)
          );
        });
      },
    };
  };
