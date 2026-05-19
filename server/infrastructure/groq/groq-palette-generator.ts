import Groq from "groq-sdk";
import type {
  PaletteGeneratorPort,
  PaletteGeneratorResult,
  PaletteHslColor,
} from "~/server/application/ports/palette-generator.port";
import {
  DEFAULT_EMOTION_OPTION,
  DEFAULT_INTENSITY,
  normalizeEmotion,
  normalizeHarmony,
  normalizeIntensity,
  clamp,
  type HarmonyOption,
} from "~/shared/palette/preferences";
import type { PaletteTraceStep } from "~/shared/palette/api-contract";

const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const TARGET_COLOR_COUNT = 6;
const AUTO_HARMONY_BLEND_FACTOR = 0.28;

export interface PaletteGeneratorConfig {
  groqApiKey?: string;
  groqModel?: string;
}

export class GroqPaletteGenerator implements PaletteGeneratorPort {
  constructor(private readonly config: PaletteGeneratorConfig = {}) {}

  async generatePalette(
    input: string,
    options?: { harmony?: string },
  ): Promise<PaletteGeneratorResult> {
    const startedAt = Date.now();
    const steps: PaletteTraceStep[] = [];
    const harmony = normalizeHarmony(options?.harmony);
    const normalizedInput = input.trim();
    const apiKey = this.config.groqApiKey || process.env.GROQ_API_KEY;
    const model =
      this.config.groqModel || process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;

    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY runtime configuration");
    }

    const client = new Groq({ apiKey });
    const requestStart = Date.now();
    const response = await client.chat.completions.create({
      model,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "You are an expert color designer for digital interfaces.",
            "You generate color palettes in HSL.",
            "Colors should feel intentional, not random.",
            "Always answer with strict JSON only, never markdown.",
            `Return this schema: {"paletteHsl":[{"h":number,"s":number,"l":number}...], "reasoning":{"tone":string,"harmony":string,"colorCount":number,"emotion":string,"intensity":number}}`,
            `paletteHsl must include exactly ${TARGET_COLOR_COUNT} colors.`,
            "h must be 0..359, s and l must be 0..100.",
            "Consider emotional, cultural, and sensory associations from the input scene.",
            "Let the input meaning guide hue selection, not only harmony templates.",
            "Example: football match -> energetic greens, warm crowd/stadium accents.",
            "Example: winter night -> cold blues, deep darks, muted tones.",
            "Avoid colors with l < 10 or l > 95 unless the input explicitly suggests extremes.",
            "Ensure noticeable contrast between swatches for practical UI use.",
            'reasoning.emotion must be one of: "neutral", "vibrant", "calm", "dark", "warm", "cool".',
            "reasoning.intensity must be a number from 0 to 1.",
            "Do not generate rainbow-like full-spectrum palettes unless explicitly requested.",
            "Avoid gradient-like palettes with tiny hue steps; include clearly distinct swatches.",
          ].join(" "),
        } as const,
        {
          role: "user",
          content: [
            `Scene or mood: "${input}"`,
            `Harmony preference: "${harmony}"`,
            "Emotion hint: derive from the scene; do not default to neutral unless truly ambiguous.",
            `Prioritize colors that a human would immediately associate with: "${input}".`,
          ].join("\n"),
        } as const,
      ],
    });

    steps.push({
      step: "provider_request",
      status: "ok",
      attempt: 1,
      durationMs: Date.now() - requestStart,
      detail: `provider:groq model:${model} harmony:${harmony}`,
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("Groq response did not include a valid content payload");
    }

    const parseStart = Date.now();
    const parsedResult = parseJsonObject(content);
    const parsed = parsedResult.value;
    const rawPaletteHsl = normalizePalette(parsed.paletteHsl);
    const blendedPaletteHsl =
      harmony === "auto"
        ? blendPaletteTowardsAverage(rawPaletteHsl, AUTO_HARMONY_BLEND_FACTOR)
        : rawPaletteHsl;
    const paletteHsl = ensurePaletteColorCount(
      blendedPaletteHsl,
      TARGET_COLOR_COUNT,
      harmony,
    );
    steps.push({
      step: "response_parse",
      status: "ok",
      attempt: 1,
      durationMs: Date.now() - parseStart,
      detail: `${rawPaletteHsl.length}->${paletteHsl.length} colors fallback:${parsedResult.usedFallback ? "yes" : "no"} blended:${harmony === "auto" ? "yes" : "no"}`,
    });
    steps.push({
      step: "palette_normalization",
      status: "ok",
      attempt: 1,
      durationMs: 0,
      detail: `requested:${TARGET_COLOR_COUNT} received:${paletteHsl.length}`,
    });

    if (paletteHsl.length < 3) {
      throw new Error("Model response does not contain enough HSL colors");
    }

    return {
      paletteHsl,
      trace: {
        totalDurationMs: Date.now() - startedAt,
        provider: "groq",
        model,
        inputPreview: buildInputPreview(normalizedInput),
        requestedHarmony: options?.harmony ?? "auto",
        resolvedHarmony: harmony,
        responseChars: content.length,
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
        parsedWithFallback: parsedResult.usedFallback,
        outputColorCount: paletteHsl.length,
        steps,
      },
      reasoning: buildReasoning(parsed.reasoning, harmony, paletteHsl.length),
    };
  }
}

function parseJsonObject(content: string): {
  value: Record<string, unknown>;
  usedFallback: boolean;
} {
  try {
    const parsed = JSON.parse(content);
    if (typeof parsed === "object" && parsed !== null) {
      return {
        value: parsed as Record<string, unknown>,
        usedFallback: false,
      };
    }
  } catch {
    // Fallback below.
  }

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const maybeJson = content.slice(start, end + 1);
    const parsed = JSON.parse(maybeJson);
    if (typeof parsed === "object" && parsed !== null) {
      return {
        value: parsed as Record<string, unknown>,
        usedFallback: true,
      };
    }
  }

  throw new Error("Could not parse JSON object from Groq response");
}

function buildInputPreview(value: string): string {
  if (!value) return "";
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length <= 120 ? compact : `${compact.slice(0, 117)}...`;
}

function normalizePalette(value: unknown): PaletteHslColor[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const color = item as Partial<PaletteHslColor>;
      const h = Number(color.h);
      const s = Number(color.s);
      const l = Number(color.l);
      if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l)) {
        return null;
      }
      return {
        h: clamp(Math.round(h), 0, 359),
        s: clamp(Math.round(s), 0, 100),
        l: clamp(Math.round(l), 0, 100),
      };
    })
    .filter((color): color is PaletteHslColor => color !== null)
    .slice(0, TARGET_COLOR_COUNT);
}

function blendPaletteTowardsAverage(
  palette: PaletteHslColor[],
  factor: number,
): PaletteHslColor[] {
  if (palette.length < 2) return palette;

  const blend = clamp(factor, 0, 1);
  const meanHue = circularMeanHue(palette.map((color) => color.h));
  const meanSaturation =
    palette.reduce((sum, color) => sum + color.s, 0) / palette.length;
  const meanLightness =
    palette.reduce((sum, color) => sum + color.l, 0) / palette.length;

  return palette.map((color) => ({
    h: clamp(Math.round(blendHue(color.h, meanHue, blend)), 0, 359),
    s: clamp(
      Math.round(color.s + (meanSaturation - color.s) * blend),
      0,
      100,
    ),
    l: clamp(
      Math.round(color.l + (meanLightness - color.l) * blend),
      0,
      100,
    ),
  }));
}

function circularMeanHue(hues: number[]): number {
  const radians = hues.map((hue) => (hue * Math.PI) / 180);
  const sin = radians.reduce((sum, angle) => sum + Math.sin(angle), 0);
  const cos = radians.reduce((sum, angle) => sum + Math.cos(angle), 0);
  const angle = Math.atan2(sin, cos);
  const degrees = (angle * 180) / Math.PI;
  return degrees < 0 ? degrees + 360 : degrees;
}

function blendHue(from: number, to: number, factor: number): number {
  const directDelta = ((to - from + 540) % 360) - 180;
  const blended = from + directDelta * factor;
  const normalized = blended % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function ensurePaletteColorCount(
  palette: PaletteHslColor[],
  targetCount: number,
  harmony: HarmonyOption,
): PaletteHslColor[] {
  if (palette.length >= targetCount) return palette.slice(0, targetCount);
  if (palette.length === 0) return [];

  // Triadic prompts can return just the 3 base hues; expand them to 6 swatches.
  if (harmony !== "triadic") return palette;

  const expanded = [...palette];
  let variantIndex = 0;

  while (expanded.length < targetCount) {
    const source = palette[variantIndex % palette.length];
    const delta = variantIndex % 2 === 0 ? 10 : -10;
    expanded.push({
      h: source.h,
      s: clamp(source.s + (delta > 0 ? -6 : 6), 0, 100),
      l: clamp(source.l + delta, 0, 100),
    });
    variantIndex += 1;
  }

  return expanded.slice(0, targetCount);
}

function buildReasoning(
  value: unknown,
  harmony: HarmonyOption,
  colorCount: number,
): Record<string, unknown> {
  if (!value || typeof value !== "object") {
    return {
      harmony,
      colorCount,
      emotion: DEFAULT_EMOTION_OPTION,
      intensity: DEFAULT_INTENSITY,
    };
  }

  const reasoning = value as Record<string, unknown>;
  return {
    ...reasoning,
    harmony:
      typeof reasoning.harmony === "string" && reasoning.harmony.trim()
        ? reasoning.harmony
        : harmony,
    colorCount:
      typeof reasoning.colorCount === "number" && Number.isFinite(reasoning.colorCount)
        ? reasoning.colorCount
        : colorCount,
    emotion: normalizeEmotion(reasoning.emotion),
    intensity: normalizeIntensity(reasoning.intensity),
  };
}
