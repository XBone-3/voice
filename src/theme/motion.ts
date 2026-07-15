// Simplified Material 3 duration tokens, in ms. The full M3 spec defines
// 12 duration tokens (short1-4/medium1-4/long1-4); collapsed to 3 buckets
// here since nothing consumes finer granularity yet — expand when Phase 091
// (Animations) actually needs it. Mode-independent — shared by light.ts and
// dark.ts.
export const motion = {
  durationShort: 100,
  durationMedium: 300,
  durationLong: 500,
} as const;
