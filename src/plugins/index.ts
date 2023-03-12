import fs from "fs-extra";
import path from "path";
import { getWorkingDir } from "~/utils/get-user-data";

type Plugin = {
  copyDirs?: { from: string; to: string; internal?: boolean }[];
  copyFiles?: { from: string; to: string; internal?: boolean }[];
  replaceFiles?: { from: string; to: string; internal?: boolean }[];
  addLines?: { file: string; lines: string[] }[];
  replaceInFiles?: { file: string; from: string; to: string }[];
};

export const createPlugin =
  <T>(pluginFactory: (variables: T) => Plugin) =>
  (projectName: string, data: T) => {
    const projectPath = path.join(getWorkingDir(), projectName);

    return {
      apply: () => {
        const plugin = pluginFactory(data);

        (plugin.copyDirs || []).forEach((copyDir) => {
          const parentDir = path.dirname(path.join(projectPath, copyDir.to));

          if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
          }

          fs.copySync(
            path.join(
              copyDir.internal ? projectPath : process.env.PKG_ROOT || "",
              copyDir.from
            ),
            path.join(projectPath, copyDir.to)
          );
        });

        (plugin.copyFiles || []).forEach((copyFile) => {
          const parentDir = path.dirname(path.join(projectPath, copyFile.to));

          if (!fs.existsSync(parentDir)) {
            fs.mkdirSync(parentDir, { recursive: true });
          }

          fs.copyFileSync(
            path.join(
              copyFile.internal ? projectPath : process.env.PKG_ROOT || "",
              copyFile.from
            ),
            path.join(projectPath, copyFile.to)
          );
        });

        (plugin.replaceFiles || []).forEach((replaceFile) => {
          fs.writeFileSync(
            path.join(projectPath, replaceFile.to),
            fs.readFileSync(
              path.join(
                replaceFile.internal ? projectPath : process.env.PKG_ROOT || "",
                replaceFile.from
              )
            )
          );
        });

        (plugin.addLines || []).forEach((addLine) => {
          fs.writeFileSync(
            path.join(projectPath, addLine.file),
            fs.readFileSync(path.join(projectPath, addLine.file)).toString() +
              addLine.lines.join("\n")
          );
        });

        (plugin.replaceInFiles || []).forEach((replaceInFile) => {
          fs.writeFileSync(
            path.join(projectPath, replaceInFile.file),
            fs
              .readFileSync(path.join(projectPath, replaceInFile.file))
              .toString()
              .replace(replaceInFile.from, replaceInFile.to)
          );
        });
      },
    };
  };
