import {
  DEFAULT_INTENSITY,
  normalizeIntensity,
  type EmotionOption,
} from "~/shared/palette/preferences";

export type HslColor = { h: number; s: number; l: number };

export function toPresentedHexPalette(
  basePalette: HslColor[],
  emotion: EmotionOption,
  intensity: number,
): string[] {
  return basePalette
    .map((color) => applyPresentationTransform(color, emotion, intensity))
    .map(hslToHex);
}

function applyPresentationTransform(
  color: HslColor,
  emotion: EmotionOption,
  intensity: number,
): HslColor {
  const power = normalizeIntensity(intensity, DEFAULT_INTENSITY);
  const hueShift =
    emotion === "warm" ? 22 * power : emotion === "cool" ? -22 * power : 0;
  const saturationDelta =
    emotion === "vibrant"
      ? 28 * power
      : emotion === "calm"
        ? -24 * power
        : emotion === "dark"
          ? 8 * power
          : emotion === "warm" || emotion === "cool"
            ? 12 * power
            : 0;
  const lightnessDelta =
    emotion === "vibrant"
      ? 6 * power
      : emotion === "calm"
        ? 10 * power
        : emotion === "dark"
          ? -26 * power
          : 0;

  return {
    h: normalizeHue(color.h + hueShift),
    s: clampPercentage(color.s + saturationDelta),
    l: clampPercentage(color.l + lightnessDelta),
  };
}

function hslToHex(hsl: HslColor): string {
  const normalizedHue = normalizeHue(hsl.h);
  const normalizedSaturation = clampPercentage(hsl.s);
  const normalizedLightness = clampPercentage(hsl.l);
  const s = normalizedSaturation / 100;
  const l = normalizedLightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((normalizedHue / 60) % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;
  if (normalizedHue < 60) {
    rPrime = c;
    gPrime = x;
  } else if (normalizedHue < 120) {
    rPrime = x;
    gPrime = c;
  } else if (normalizedHue < 180) {
    gPrime = c;
    bPrime = x;
  } else if (normalizedHue < 240) {
    gPrime = x;
    bPrime = c;
  } else if (normalizedHue < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  const r = Math.round((rPrime + m) * 255);
  const g = Math.round((gPrime + m) * 255);
  const b = Math.round((bPrime + m) * 255);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function normalizeHue(value: number): number {
  const hue = value % 360;
  return hue < 0 ? hue + 360 : hue;
}

function clampPercentage(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function toHex(value: number): string {
  return value.toString(16).padStart(2, "0");
}
