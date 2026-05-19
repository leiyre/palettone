import { describe, expect, it } from "vitest";
import {
  DEFAULT_INTENSITY,
  normalizeEmotion,
  normalizeHarmony,
  normalizeIntensity,
} from "~/shared/palette/preferences";

describe("palette preferences", () => {
  it("normalizes harmony aliases and casing", () => {
    expect(normalizeHarmony("split_complementary")).toBe("split-complementary");
    expect(normalizeHarmony("TRIADIC")).toBe("triadic");
  });

  it("falls back to analogous for unknown harmony", () => {
    expect(normalizeHarmony("unexpected-value")).toBe("analogous");
  });

  it("normalizes emotion and intensity safely", () => {
    expect(normalizeEmotion("Calm")).toBe("calm");
    expect(normalizeEmotion("unknown")).toBe("neutral");
    expect(normalizeIntensity(2)).toBe(1);
    expect(normalizeIntensity(-1)).toBe(0);
    expect(normalizeIntensity("bad")).toBe(DEFAULT_INTENSITY);
  });
});
