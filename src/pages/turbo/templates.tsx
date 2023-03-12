import { type CheckedState } from "@radix-ui/react-checkbox";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BackButton from "~/components/back-button";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { api, type RouterInputs } from "~/utils/api";
import { cn } from "~/utils/cn";
import { useTurboState } from "~/utils/zustand";

const TemplatePreview: React.FC<{
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
                T3 Turbo configuration
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

const Templates: NextPage = () => {
  const turboState = useTurboState();
  const router = useRouter();

  useEffect(() => {
    if (!turboState.name || !turboState.packageManager) {
      router.push("/turbo");
    }
  }, [turboState]);

  return (
    <div>
      <BackButton />
      <h1>Choose additional templates</h1>
      <p>Select templates below to add them to your project</p>

      <div className="mt-12 flex w-auto flex-col gap-6 sm:w-[500px]">
        <TemplatePreview
          name="NextJS"
          description="NextJS application"
          id="nextjs"
          checked
          locked
        />

        <TemplatePreview
          name="Expo"
          description="Expo application"
          id="expo"
          checked
          locked
        />

        <TemplatePreview
          name="Chrome Extension with Plasmo"
          description="A template for creating a Chrome Extension with Plasmo"
          id="chrome"
          checked={turboState.additionalTemplates?.includes("chrome") ?? false}
          onCheckedChange={(id, checked) => {
            if (checked) {
              turboState.addToAdditionalTemplates(id as "chrome");
            } else {
              turboState.removeFromAdditionalTemplates(id as "chrome");
            }
          }}
        />

        <Button
          onClick={async () => {
            if (!turboState.additionalTemplates) {
              turboState.initializeAdditionalTemplates();
            }

            await router.push("/turbo/summary");
          }}
        >
          Create project
        </Button>
      </div>
    </div>
  );
};

export default Templates;
