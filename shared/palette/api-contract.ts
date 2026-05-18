export interface PaletteTraceStep {
  step: string;
  status: "ok" | "retry";
  attempt: number;
  durationMs: number;
  detail?: string;
}

export interface PaletteTrace {
  totalDurationMs: number;
  provider?: string;
  model?: string;
  inputPreview?: string;
  requestedHarmony?: string;
  resolvedHarmony?: string;
  responseChars?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  parsedWithFallback?: boolean;
  outputColorCount?: number;
  steps: PaletteTraceStep[];
}

export interface PaletteHslColor {
  h: number;
  s: number;
  l: number;
}

export interface PaletteReasoning {
  tone?: string;
  lightnessIntent?: string;
  harmony?: string;
  colorCount?: number;
  emotion?: string;
  intensity?: number;
}
