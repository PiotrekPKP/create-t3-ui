import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BackButton from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { type TurboActivePlugins } from "~/plugins/public";
import { api } from "~/utils/api";
import { useTurboState } from "~/utils/zustand";

const Plugins: NextPage = () => {
  const turboState = useTurboState();
  const router = useRouter();

  const { data } = api.plugin.getTurboPlugins.useQuery();

  useEffect(() => {
    if (
      !turboState.name ||
      !turboState.packageManager ||
      !turboState.additionalTemplates
    ) {
      router.push("/turbo");
    }
  }, [turboState, router]);

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
                checked={turboState.plugins
                  ?.map((p) => p.pluginId)
                  .includes(plugin.id as unknown as TurboActivePlugins)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    turboState.addToPlugins({
                      pluginId: plugin.id as unknown as TurboActivePlugins,
                      data: {},
                    });
                  } else {
                    turboState.removeFromPlugins(
                      plugin.id as unknown as TurboActivePlugins
                    );
                  }
                }}
              />
              <h3 className="!my-0">{plugin.name}</h3>
            </div>
            <p className="!mt-2">{plugin.description}</p>
          </div>
        ))}

        <Button onClick={async () => await router.push("/turbo/summary")}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default Plugins;
