import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BackButton from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { AppActivePlugins, type TurboActivePlugins } from "~/plugins/public";
import { api } from "~/utils/api";
import { useAppState } from "~/utils/zustand";

const Plugins: NextPage = () => {
  const appState = useAppState();
  const router = useRouter();

  const { data } = api.plugin.getAppPlugins.useQuery();

  useEffect(() => {
    if (!appState.name || !appState.packageManager || !appState.extensions) {
      router.push("/app");
    }
  }, [appState, router]);

  return (
    <div>
      <BackButton />
      <h1>Plugins</h1>
      <p>Add plugins to your project initialization!</p>

      <div className="mt-12 flex w-auto flex-col gap-8 sm:w-96">
        {data?.map((plugin) => (
          <div key={plugin.id}>
            <div className="flex items-center gap-4">
              <Checkbox
                checked={appState.plugins
                  ?.map((p) => p.pluginId)
                  .includes(plugin.id as unknown as AppActivePlugins)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    appState.addToPlugins({
                      pluginId: plugin.id as unknown as AppActivePlugins,
                      data: {},
                    });
                  } else {
                    appState.removeFromPlugins(
                      plugin.id as unknown as AppActivePlugins
                    );
                  }
                }}
              />
              <h3 className="!my-0">{plugin.name}</h3>
            </div>
            <p className="!mt-2">{plugin.description}</p>
          </div>
        ))}

        <Button
          onClick={async () => {
            if (!appState.plugins) {
              appState.initializePlugins();
            }

            await router.push("/app/summary");
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Plugins;
