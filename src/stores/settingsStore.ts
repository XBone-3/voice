import { create } from 'zustand';

export type ThemeOverride = 'system' | 'light' | 'dark';

interface SettingsState {
  themeOverride: ThemeOverride;
  setThemeOverride: (value: ThemeOverride) => void;
}

/**
 * In-memory only — no persistence. Real persistence (Android DataStore via
 * a native module) is explicitly Phase 023 (Storage Layer) / Phase 024
 * (Configuration Repository)'s job, once Phase 016 (Native Module
 * Infrastructure) exists. Building persistence here would mean ripping it
 * out again once that native-backed mechanism lands. See ADR-024.
 */
export const useSettingsStore = create<SettingsState>(set => ({
  themeOverride: 'system',
  setThemeOverride: value => set({ themeOverride: value }),
}));
