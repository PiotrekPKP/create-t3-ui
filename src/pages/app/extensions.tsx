import { type CheckedState } from "@radix-ui/react-checkbox";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BackButton from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/utils/cn";
import { useAppState } from "~/utils/zustand";

const ExtensionPreview: React.FC<{
  name: string;
  description: string;
  id: string;
  checked: CheckedState;
  onCheckedChange?: (id: string, checked: CheckedState) => void;
  locked?: boolean;
}> = ({ name, description, id, checked, onCheckedChange, locked }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-8 rounded-md bg-black/10 p-6 dark:bg-white/10",
        locked && "cursor-not-allowed !bg-black/5 dark:!bg-white/5"
      )}
    >
      <div>
        {locked ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Checkbox
                  className={cn(
                    "h-10 w-10 border-black/30 dark:border-white/30",
                    locked && "cursor-not-allowed"
                  )}
                  checked={checked}
                  onCheckedChange={(c) => onCheckedChange?.(id, c)}
                />
              </TooltipTrigger>
              <TooltipContent>
                You cannot unselect this item as is comes with the base Create
                T3 App configuration
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Checkbox
            className={cn(
              "h-10 w-10 border-black/30 dark:border-white/30",
              locked && "cursor-not-allowed"
            )}
            checked={checked}
            onCheckedChange={(c) => onCheckedChange?.(id, c)}
          />
        )}
      </div>
      <div>
        <h4 className="!mt-0">{name}</h4>
        <p className="!mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
};

const Extensions: NextPage = () => {
  const appState = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (!appState.name || !appState.packageManager) {
      router.push("/app");
    }
  }, [appState, router]);

  return (
    <div>
      <BackButton />
      <h1>Choose app extensions</h1>
      <p>Select extensions below to add them to your project</p>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExtensionPreview
          name="Environment variables"
          description="Adds type-safe environment variables to your project"
          id="env"
          checked
          locked
        />

        <ExtensionPreview
          name="tRPC"
          description="Includes tRPC in the project"
          id="trpc"
          checked={appState.extensions?.includes("trpc") ?? false}
          onCheckedChange={(id, checked) => {
            if (checked) {
              appState.addToExtensions(id as "trpc");
            } else {
              appState.removeFromExtensions(id as "trpc");
            }
          }}
        />

        <ExtensionPreview
          name="Prisma"
          description="Includes Prisma in the project"
          id="prisma"
          checked={appState.extensions?.includes("prisma") ?? false}
          onCheckedChange={(id, checked) => {
            if (checked) {
              appState.addToExtensions(id as "prisma");
            } else {
              appState.removeFromExtensions(id as "prisma");
            }
          }}
        />

        <ExtensionPreview
          name="NextAuth.js"
          description="Includes NextAuth.js in the project"
          id="nextAuth"
          checked={appState.extensions?.includes("nextAuth") ?? false}
          onCheckedChange={(id, checked) => {
            if (checked) {
              appState.addToExtensions(id as "nextAuth");
            } else {
              appState.removeFromExtensions(id as "nextAuth");
            }
          }}
        />

        <ExtensionPreview
          name="Tailwind CSS"
          description="Includes Tailwind CSS in the project"
          id="tailwind"
          checked={appState.extensions?.includes("tailwind") ?? false}
          onCheckedChange={(id, checked) => {
            if (checked) {
              appState.addToExtensions(id as "tailwind");
            } else {
              appState.removeFromExtensions(id as "tailwind");
            }
          }}
        />
      </div>

      <Button
        className="mt-8 w-full sm:w-96"
        onClick={async () => {
          if (!appState.extensions) {
            appState.initializeExtensions();
          }

          await router.push("/app/plugins");
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default Extensions;
