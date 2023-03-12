import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BackButton from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/utils/api";
import { type PackageManager } from "~/utils/get-user-data";
import { useAppState } from "~/utils/zustand";

const Summary: NextPage = () => {
  const appState = useAppState();
  const router = useRouter();

  const [settingUp, setSettingUp] = useState(false);

  const { mutateAsync } = api.project.createApp.useMutation();

  useEffect(() => {
    if (
      !appState.name ||
      !appState.packageManager ||
      !appState.extensions ||
      !appState.plugins
    ) {
      router.push("/app");
    }
  }, [appState, router]);

  const createProject = async () => {
    setSettingUp(true);

    await mutateAsync({
      name: appState.name || "",
      packageManager: appState.packageManager || ("" as PackageManager),
      extensions: appState.extensions || [],
      plugins: appState.plugins || [],
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
      <BackButton />
      <h1>Summary</h1>
      <p>Check everything. Press create project afterwards.</p>

      <div className="mt-12 flex w-auto flex-col gap-8 sm:w-96">
        <div className="flex flex-col gap-2">
          <Label>Project name</Label>
          <span className="text-xl">{appState.name}</span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Package manager</Label>
          <span className="text-xl">{appState.packageManager}</span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Extensions</Label>
          <span className="text-xl">
            {["envVariables", ...(appState.extensions || [])].join(", ")}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Plugins</Label>
          <span className="text-xl">
            {appState.plugins && appState.plugins.length > 0
              ? appState.plugins?.map((p) => p.pluginId).join(", ")
              : "No plugins"}
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
