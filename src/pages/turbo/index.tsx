import { type NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AppType } from "../_app";
import { InputWithText } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

declare global {
  interface Window {
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
  }
}

type FormData = { name: string; projectPath: string };

const Index: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(
      z.object({
        name: z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: "Name should only contain lowercase characters and dashes",
          })
          .min(1),
        projectPath: z.string().min(2),
      })
    ),
    defaultValues: {
      name: "",
      projectPath:
        typeof window !== "undefined"
          ? localStorage.getItem("__T3_UI_DIR__") ??
            "/home/peter/Programming/create-t3-ui"
          : "",
    },
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    localStorage.setItem(
      "__T3_UI_DATA__",
      JSON.stringify({ ...data, appType: AppType.TURBO })
    );

    await router.push("/setup");
  });

  const projectName = watch("name");

  const [projectPath, setProjectPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const projectPathRaw =
        localStorage.getItem("__T3_UI_DIR__") ||
        "/home/peter/Programming/create-t3-ui";
      const projectPath = `${projectPathRaw}/${projectName}`;
      setProjectPath(projectPath);
      setValue("projectPath", projectPath);
    }
  }, [projectPath, projectName, setValue]);

  return (
    <>
      <div>
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
              inputProps={register("name")}
              label="Project name"
              error={errors.name?.message}
            />

            <InputWithText
              inputProps={{ disabled: true, value: projectPath }}
              label="Path to your project"
              error={errors.projectPath?.message}
            />

            <Button type="submit" className="mt-6">
              Create project
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Index;
