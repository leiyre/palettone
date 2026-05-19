import { computed, ref } from "vue";
import type { PaletteRequestTrace } from "~/application/ports/palette-api.port";
import {
  toPresentedHexPalette,
  type HslColor,
} from "~/composables/palette-presentation";
import {
  DEFAULT_INTENSITY,
  EMOTION_OPTIONS,
  HARMONY_OPTIONS,
  isHarmonyOption,
  normalizeEmotion,
  normalizeIntensity,
  type EmotionOption,
  type HarmonyOption,
} from "~/shared/palette/preferences";

export function usePalette() {
  const { $generatePalette } = useNuxtApp();
  const inputText = ref("");
  const currentColors = ref<string[]>([]);
  const basePaletteHsl = ref<HslColor[]>([]);
  const currentDescription = ref("");
  const currentEmotion = ref<EmotionOption>("neutral");
  const intensity = ref(DEFAULT_INTENSITY);
  const selectedHarmony = ref<HarmonyOption>("auto");
  const isLoading = ref(false);
  const loadingStatus = ref<string | null>(null);
  const error = ref<string | null>(null);
  const lastRequestTrace = ref<PaletteRequestTrace | null>(null);
  const copyFeedback = ref<string | null>(null);
  const saved = ref(false);

  let copyFeedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  const hasGeneratedPalette = computed(() => currentColors.value.length > 0);

  const waveBandColors = computed(() => {
    if (!currentColors.value.length) return [];
    return Array.from(
      { length: 6 },
      (_, index) => currentColors.value[index % currentColors.value.length],
    );
  });

  const recomputePaletteFromBase = () => {
    if (!basePaletteHsl.value.length) return;
    currentColors.value = toPresentedHexPalette(
      basePaletteHsl.value,
      currentEmotion.value,
      intensity.value,
    );
  };

  const generatePalette = async () => {
    isLoading.value = true;
    error.value = null;
    currentColors.value = [];
    loadingStatus.value = "Validating prompt...";
    lastRequestTrace.value = null;

    try {
      loadingStatus.value = `Generating palette (${selectedHarmony.value})...`;
      const result = await $generatePalette.execute({
        rawText: inputText.value,
        harmony:
          selectedHarmony.value === "auto" ? undefined : selectedHarmony.value,
      });
      basePaletteHsl.value = result.paletteHsl;
      currentEmotion.value = normalizeEmotion(result.reasoning?.emotion);
      intensity.value = normalizeIntensity(result.reasoning?.intensity);
      currentDescription.value = result.description;
      recomputePaletteFromBase();
      lastRequestTrace.value = result.trace ?? null;
      saved.value = false;

      if (currentColors.value.length < 3) {
        throw new Error("Unexpected server response");
      }
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : "Error generating palette";
      currentColors.value = [];
    } finally {
      loadingStatus.value = null;
      isLoading.value = false;
    }
  };

  const setHarmony = (harmony: string) => {
    if (!isHarmonyOption(harmony)) return;
    selectedHarmony.value = harmony;
  };

  const setEmotion = (emotion: string) => {
    currentEmotion.value = normalizeEmotion(emotion);
    recomputePaletteFromBase();
  };

  const setIntensity = (value: number) => {
    intensity.value = normalizeIntensity(value, intensity.value);
    recomputePaletteFromBase();
  };

  const showToast = (message: string) => {
    copyFeedback.value = message;
    if (copyFeedbackTimeout) clearTimeout(copyFeedbackTimeout);
    copyFeedbackTimeout = setTimeout(() => {
      copyFeedback.value = null;
      copyFeedbackTimeout = null;
    }, 1800);
  };

  const copyToClipboard = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      showToast(`${color} copied`);
    } catch {
      showToast("Could not copy color");
    }
  };

  const applySavedPalette = (colors: string[]) => {
    currentColors.value = [...colors];
    basePaletteHsl.value = [];
    saved.value = false;
  };

  const markCurrentPaletteAsSaved = () => {
    saved.value = true;
  };

  return {
    inputText,
    currentColors,
    currentDescription,
    currentEmotion,
    intensity,
    isLoading,
    error,
    loadingStatus,
    lastRequestTrace,
    copyFeedback,
    saved,
    hasGeneratedPalette,
    waveBandColors,
    harmonyOptions: [...HARMONY_OPTIONS],
    emotionOptions: [...EMOTION_OPTIONS],
    selectedHarmony,
    generatePalette,
    setHarmony,
    setEmotion,
    setIntensity,
    showToast,
    copyToClipboard,
    applySavedPalette,
    markCurrentPaletteAsSaved,
  };
}
