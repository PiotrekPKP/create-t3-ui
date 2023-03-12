import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/utils/api";
import { useTurboState } from "~/utils/zustand";

const Summary: NextPage = () => {
  const turboState = useTurboState();
  const router = useRouter();

  const [settingUp, setSettingUp] = useState(false);

  const { mutateAsync } = api.project.createTurbo.useMutation();

  useEffect(() => {
    if (
      !turboState.name ||
      !turboState.packageManager ||
      !turboState.additionalTemplates
    ) {
      router.push("/turbo");
    }
  }, [turboState, router]);

  const createProject = async () => {
    setSettingUp(true);

    await mutateAsync({
      name: turboState.name || "",
      packageManager: turboState.packageManager || "pnpm",
      additionalTemplates: turboState.additionalTemplates || [],
    });

    await router.push("/done");
  };

  if (settingUp) {
    return (
      <div>
        <h1>Setting up your project...</h1>
        <p>Wait for everything to finish...</p>

        <div className="mt-12">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Summary</h1>
      <p>Check everything. Press create project afterwards.</p>

      <div className="mt-12 flex w-auto flex-col gap-8 sm:w-96">
        <div className="flex flex-col gap-2">
          <Label>Project name</Label>
          <span className="text-xl">{turboState.name}</span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Package manager</Label>
          <span className="text-xl">{turboState.packageManager}</span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Templates</Label>
          <span className="text-xl">
            {["nextjs", "expo", ...(turboState.additionalTemplates || [])].join(
              ", "
            )}
          </span>
        </div>

        <Button onClick={async () => await createProject()}>
          Create project
        </Button>
      </div>
    </div>
  );
};

export default Summary;
