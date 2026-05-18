export const HARMONY_OPTIONS = [
  "auto",
  "analogous",
  "complementary",
  "triadic",
  "split-complementary",
  "monochromatic",
] as const;

export const EMOTION_OPTIONS = [
  "neutral",
  "vibrant",
  "calm",
  "dark",
  "warm",
  "cool",
] as const;

export const DEFAULT_EMOTION_OPTION = "neutral";
export const DEFAULT_INTENSITY = 0.55;

export type HarmonyOption = (typeof HARMONY_OPTIONS)[number];
export type EmotionOption = (typeof EMOTION_OPTIONS)[number];

export function isHarmonyOption(value: unknown): value is HarmonyOption {
  return (
    typeof value === "string" &&
    (HARMONY_OPTIONS as readonly string[]).includes(value)
  );
}

export function normalizeHarmony(value: unknown): HarmonyOption {
  if (typeof value !== "string") return "auto";
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized === "auto") return "auto";
  if (normalized === "complementary") return "complementary";
  if (normalized === "triadic") return "triadic";
  if (
    normalized === "split-complementary" ||
    normalized === "split_complementary"
  ) {
    return "split-complementary";
  }
  if (normalized === "monochromatic") return "monochromatic";
  return "analogous";
}

export function normalizeEmotion(value: unknown): EmotionOption {
  if (typeof value !== "string") return DEFAULT_EMOTION_OPTION;
  const normalized = value.trim().toLowerCase();
  return (EMOTION_OPTIONS as readonly string[]).includes(normalized)
    ? (normalized as EmotionOption)
    : DEFAULT_EMOTION_OPTION;
}

export function normalizeIntensity(
  value: unknown,
  fallback = DEFAULT_INTENSITY,
): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return clamp(value, 0, 1);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
