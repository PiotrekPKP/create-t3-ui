import { create } from "zustand";
import {
  type AppActivePlugins,
  type TurboActivePlugins,
} from "~/plugins/public";
import { type PackageManager } from "./get-user-data";

type AdditionalTemplateTurbo = "chrome";

type TurboPlugin = {
  pluginId: TurboActivePlugins;
  data: unknown;
};

interface TurboState {
  name?: string;
  packageManager?: "pnpm";
  additionalTemplates?: AdditionalTemplateTurbo[];
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
  initializePlugins: () => void;
  clearStore: () => void;
}

export const useTurboState = create<TurboState & TurboAction>((set) => ({
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
  initializePlugins: () => set({ plugins: [] }),
  clearStore: () =>
    set({
      name: undefined,
      packageManager: undefined,
      additionalTemplates: undefined,
      plugins: undefined,
    }),
}));

type AppPlugin = {
  pluginId: AppActivePlugins;
  data: unknown;
};

interface AppState {
  name?: string;
  packageManager?: PackageManager;
  extensions?: ("trpc" | "prisma" | "nextAuth" | "tailwind")[];
  plugins?: AppPlugin[];
}

interface AppAction {
  setName: (name: AppState["name"]) => void;
  setPackageManager: (packageManager: AppState["packageManager"]) => void;
  addToExtensions: (
    extension: NonNullable<AppState["extensions"]>[number]
  ) => void;
  removeFromExtensions: (
    extension: NonNullable<AppState["extensions"]>[number]
  ) => void;
  addToPlugins: (
    additionalTemplate: NonNullable<AppState["plugins"]>[number]
  ) => void;
  removeFromPlugins: (
    additionalTemplate: NonNullable<AppState["plugins"]>[number]["pluginId"]
  ) => void;
  initializePlugins: () => void;
  initializeExtensions: () => void;
  clearStore: () => void;
}

export const useAppState = create<AppState & AppAction>((set) => ({
  setName: (name) => set({ name }),
  setPackageManager: (packageManager) => set({ packageManager }),
  addToExtensions: (ext) =>
    set((state) => ({
      extensions: [...(state.extensions || []), ext],
    })),
  removeFromExtensions: (ext) =>
    set((state) => ({
      extensions: (state.extensions || []).filter((e) => e !== ext),
    })),
  addToPlugins: (plugin) =>
    set((state) => ({
      plugins: [...(state.plugins || []), plugin],
    })),
  removeFromPlugins: (plugin) =>
    set((state) => ({
      plugins: (state.plugins || []).filter((p) => p.pluginId !== plugin),
    })),
  initializePlugins: () => set({ plugins: [] }),
  initializeExtensions: () => set({ extensions: [] }),
  clearStore: () =>
    set({
      name: undefined,
      packageManager: undefined,
      plugins: undefined,
    }),
}));
