import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { InputWithText } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { api, RouterInputs } from "~/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import BackButton from "~/components/back-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type FormData = RouterInputs["project"]["createTurbo"];

export const projectMetaSchema = z.object({
  name: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Name should only contain lowercase characters and dashes",
    })
    .min(1),
  packageManager: z.enum(["pnpm"], {
    invalid_type_error: "You can only use pnpm with Create T3 Turbo",
    required_error: "Choose the package manager",
  }),
});

const Index: NextPage = () => {
  const { data } = api.metadata.getCurrentDirectory.useQuery();
  const { mutateAsync } = api.project.createTurbo.useMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(projectMetaSchema),
    defaultValues: {
      packageManager: "pnpm",
    },
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSettingUp(true);
      await mutateAsync(data);
      await router.push("/done");
    } catch (e) {}
  });

  const [projectName, packageManager] = watch(["name", "packageManager"]);
  const [projectPath, setProjectPath] = useState("");
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const projectPathRaw = data || "/";
      const projectPath = `${
        projectPathRaw.endsWith("/") ? projectPathRaw : projectPathRaw + "/"
      }${projectName}`;
      setProjectPath(projectPath);
    }
  }, [projectPath, projectName, setValue]);

  useEffect(() => {
    if (data) {
      setProjectPath(data);
    }
  }, [data]);

  if (settingUp) {
    return (
      <>
        <div>
          <h1>Setting up your project...</h1>
          <p>Wait for everything to finish...</p>
          <div className="mt-12">
            <div>Loading...</div>
          </div>
        </div>
        {!!data && (
          <div id="doneDataElement" className="hidden">
            {data}
          </div>
        )}
      </>
    );
  }

  return (
    <div>
      <BackButton />
      <h1>Create T3 Turbo</h1>
      <p>
        There&apos;s not much configuration to do here. Just fill in the data,
        click the create button and wait for your project!
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
            label="Path to your project"
          />

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label>
              Package manager{" "}
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-gray-500">(?)</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    As Create T3 Turbo utilizes workspaces, pnpm has to be the
                    package manager.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Select
              value={packageManager}
              onValueChange={(v) => setValue("packageManager", v as "pnpm")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select package manager..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pnpm">Pnpm</SelectItem>
                <SelectItem disabled value="npm">
                  Npm
                </SelectItem>
                <SelectItem disabled value="yarn">
                  Yarn
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="!mt-0 text-sm text-red-500">
              {errors.packageManager?.message}
            </p>
          </div>

          <Button type="submit" className="mt-6">
            Create project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
