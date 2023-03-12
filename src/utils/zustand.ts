import { create } from "zustand";

type AdditionalTemplate = "chrome";

interface TurboState {
  name?: string;
  packageManager?: "pnpm";
  additionalTemplates?: AdditionalTemplate[];
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
  initializeAdditionalTemplates: () => set({ additionalTemplates: [] }),
  clearStore: () =>
    set({
      name: undefined,
      packageManager: undefined,
      additionalTemplates: undefined,
    }),
}));
