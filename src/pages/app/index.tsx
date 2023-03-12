import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import BackButton from "~/components/back-button";
import { api } from "~/utils/api";
import { useAppState } from "~/utils/zustand";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { InputWithText } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { PackageManager } from "~/utils/get-user-data";
import { Button } from "~/components/ui/button";

export const projectMetaSchemaApp = z.object({
  name: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Name should only contain lowercase characters and dashes",
    })
    .min(1),
  packageManager: z.enum(["pnpm", "npm", "yarn"], {
    invalid_type_error: "Choose the correct package manager",
    required_error: "Choose the package manager",
  }),
});

const Index: NextPage = () => {
  const appState = useAppState();

  const { data } = api.metadata.getCurrentDirectory.useQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof projectMetaSchemaApp>>({
    resolver: zodResolver(projectMetaSchemaApp),
    defaultValues: {
      packageManager: "pnpm",
      name: appState.name,
    },
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      appState.setName(data.name);
      appState.setPackageManager(data.packageManager);

      await router.push("/app/extensions");
    } catch (e) {}
  });

  const [projectName, packageManager] = watch(["name", "packageManager"]);
  const [projectPath, setProjectPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const projectPathRaw = data || "/";
      const projectPath = `${
        projectPathRaw.endsWith("/") ? projectPathRaw : projectPathRaw + "/"
      }${projectName}`;
      setProjectPath(projectPath);
    }
  }, [projectPath, projectName, setValue, data]);

  useEffect(() => {
    if (data) {
      setProjectPath(data);
    }
  }, [data]);

  return (
    <div>
      <BackButton />
      <h1>Create T3 App</h1>
      <p>
        There&apos;s not much configuration to do here. Just fill in the data
        and click the next button!
      </p>

      <div className="mt-12">
        <form
          className="flex w-auto flex-col gap-6 sm:w-96"
          onSubmit={onSubmit}
        >
          <InputWithText
            inputProps={{ ...register("name"), placeholder: "Project name..." }}
            label="Project name"
            error={errors.name?.message}
          />

          <InputWithText
            inputProps={{ disabled: true, value: projectPath }}
            label={
              <>
                Path to your project{" "}
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500">(?)</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      This feature is not yet implemented. Run the tool inside
                      the directory you want to create the project in.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            }
          />

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>Package manager</Label>
            <Select
              value={packageManager}
              onValueChange={(v) =>
                setValue("packageManager", v as PackageManager)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select package manager..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pnpm">Pnpm</SelectItem>
                <SelectItem value="npm">Npm</SelectItem>
                <SelectItem value="yarn">Yarn</SelectItem>
              </SelectContent>
            </Select>
            <p className="!mt-0 text-sm text-red-500">
              {errors.packageManager?.message}
            </p>
          </div>

          <Button type="submit" className="mt-6">
            Next
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
