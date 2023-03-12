import { create } from "zustand";
import { type TurboActivePlugins } from "~/plugins/public";

type AdditionalTemplate = "chrome";
type TurboPlugin = {
  pluginId: TurboActivePlugins;
  data: unknown;
};

interface TurboState {
  name?: string;
  packageManager?: "pnpm";
  additionalTemplates?: AdditionalTemplate[];
  plugins?: TurboPlugin[];
}

interface TurboAction {
  setName: (name: TurboState["name"]) => void;
  setPackageManager: (packageManager: TurboState["packageManager"]) => void;
  addToAdditionalTemplates: (
    additionalTemplate: NonNullable<TurboState["additionalTemplates"]>[number]
  ) => void;
  removeFromAdditionalTemplates: (
    additionalTemplate: NonNullable<TurboState["additionalTemplates"]>[number]
  ) => void;
  addToPlugins: (
    additionalTemplate: NonNullable<TurboState["plugins"]>[number]
  ) => void;
  removeFromPlugins: (
    additionalTemplate: NonNullable<TurboState["plugins"]>[number]["pluginId"]
  ) => void;
  initializeAdditionalTemplates: () => void;
  clearStore: () => void;
}

export const useTurboState = create<TurboState & TurboAction>((set) => ({
  name: undefined,
  packageManager: undefined,
  additionalTemplates: undefined,
  setName: (name) => set({ name }),
  setPackageManager: (packageManager) => set({ packageManager }),
  addToAdditionalTemplates: (additionalTemplate) =>
    set((state) => ({
      additionalTemplates: [
        ...(state.additionalTemplates || []),
        additionalTemplate,
      ],
    })),
  removeFromAdditionalTemplates: (additionalTemplate) =>
    set((state) => ({
      additionalTemplates: (state.additionalTemplates || []).filter(
        (aT) => aT !== additionalTemplate
      ),
    })),
  addToPlugins: (plugin) =>
    set((state) => ({
      plugins: [...(state.plugins || []), plugin],
    })),
  removeFromPlugins: (plugin) =>
    set((state) => ({
      plugins: (state.plugins || []).filter((p) => p.pluginId !== plugin),
    })),
  initializeAdditionalTemplates: () => set({ additionalTemplates: [] }),
  clearStore: () =>
    set({
      name: undefined,
      packageManager: undefined,
      additionalTemplates: undefined,
      plugins: undefined,
    }),
}));
