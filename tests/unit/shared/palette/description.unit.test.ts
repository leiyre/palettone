import { describe, expect, it } from "vitest";
import {
  MAX_PROMPT_LENGTH,
  validatePaletteDescription,
} from "~/shared/palette/description";

describe("validatePaletteDescription", () => {
  it("trims the incoming text", () => {
    expect(validatePaletteDescription("  ocean sunset  ")).toBe("ocean sunset");
  });

  it("throws when text is empty", () => {
    expect(() => validatePaletteDescription("   ")).toThrowError("Text is required");
  });

  it("throws when text exceeds max length", () => {
    const tooLong = "a".repeat(MAX_PROMPT_LENGTH + 42);
    expect(() => validatePaletteDescription(tooLong)).toThrowError(
      `Text exceeds the maximum length (${MAX_PROMPT_LENGTH})`,
    );
  });
});
