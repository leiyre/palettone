<template>
  <div class="page">
    <UiBgPalette :colors="displayedWaveBandColors" :idle="!hasGeneratedPalette" />
    <UiThemeToggle :is-dark="isDarkTheme" @toggle="toggleTheme" />
    <AppHeader class="page__brand" heading-id="page-title" />

    <div class="page__shell">
      <main class="page__card" :aria-busy="isLoading ? 'true' : 'false'" aria-labelledby="page-title">

        <PaletteInputForm v-model="inputText" :harmony="selectedHarmony" :harmony-options="harmonyOptions"
          :is-loading="isLoading" @update:harmony="setHarmony" @submit="generatePalette" />

        <div v-if="isLoading && loadingStatus" class="page__loading" role="status" aria-live="polite"
          aria-atomic="true">
          {{ loadingStatus }}
        </div>

        <div v-if="error" class="page__error" role="alert" aria-live="assertive" aria-atomic="true">
          {{ error }}
        </div>

        <UiTrace v-if="lastRequestTrace && !isLoading">
          <p class="ui-trace__total">
            Total time: {{ lastRequestTrace.totalDurationMs }} ms
          </p>
          <ul class="ui-trace__meta">
            <li v-if="lastRequestTrace.provider || lastRequestTrace.model">
              Provider:
              {{ lastRequestTrace.provider || "unknown" }}
              <span v-if="lastRequestTrace.model">· model {{ lastRequestTrace.model }}</span>
            </li>
            <li v-if="lastRequestTrace.requestedHarmony || lastRequestTrace.resolvedHarmony">
              Harmony:
              {{ lastRequestTrace.requestedHarmony || "auto" }}
              <span v-if="lastRequestTrace.resolvedHarmony">
                → {{ lastRequestTrace.resolvedHarmony }}
              </span>
            </li>
            <li v-if="typeof lastRequestTrace.outputColorCount === 'number'">
              Colors: {{ lastRequestTrace.outputColorCount }}
            </li>
            <li v-if="typeof lastRequestTrace.responseChars === 'number'">
              Response size: {{ lastRequestTrace.responseChars }} chars
            </li>
            <li v-if="typeof lastRequestTrace.totalTokens === 'number'">
              Tokens: {{ lastRequestTrace.totalTokens }}
              <span v-if="typeof lastRequestTrace.promptTokens === 'number'">
                · prompt {{ lastRequestTrace.promptTokens }}
              </span>
              <span v-if="typeof lastRequestTrace.completionTokens === 'number'">
                · completion {{ lastRequestTrace.completionTokens }}
              </span>
            </li>
            <li v-if="typeof lastRequestTrace.parsedWithFallback === 'boolean'">
              Parser fallback:
              {{ lastRequestTrace.parsedWithFallback ? "used" : "not needed" }}
            </li>
            <li v-if="lastRequestTrace.inputPreview">
              Input preview: "{{ lastRequestTrace.inputPreview }}"
            </li>
          </ul>
          <ul class="ui-trace__list">
            <li v-for="(step, index) in lastRequestTrace.steps" :key="`${step.step}-${index}`">
              {{ step.step }} · {{ step.status }} · attempt {{ step.attempt }} ·
              {{ step.durationMs }} ms
              <span v-if="step.detail">· {{ step.detail }}</span>
            </li>
          </ul>
        </UiTrace>

        <GeneratedPalette v-if="palette.length > 0" :palette="palette" :emotion="selectedEmotion"
          :emotion-options="emotionOptions" :emotion-intensity="emotionIntensity" :saved="saved"
          @copy-color="copyToClipboard" @update:emotion="setEmotion" @update:emotion-intensity="setEmotionIntensity"
          @save-palette="saveCurrentPalette" />

        <SavedPalettesList v-if="savedPalettes.length > 0" :palettes="savedPalettes" @apply-palette="applySavedPalette"
          @remove-palette="removePalette" />
      </main>
    </div>
    <UiToast :message="copyFeedback" />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { usePaletteStore } from "~/store/palette.store";

const {
  inputText,
  currentColors: palette,
  isLoading,
  error,
  loadingStatus,
  lastRequestTrace,
  harmonyOptions,
  selectedHarmony,
  emotionOptions,
  currentEmotion: selectedEmotion,
  intensity: emotionIntensity,
  copyFeedback,
  currentDescription,
  saved,
  generatePalette,
  setHarmony,
  setEmotion,
  setIntensity: setEmotionIntensity,
  showToast,
  copyToClipboard,
  applySavedPalette,
  markCurrentPaletteAsSaved,
  hasGeneratedPalette,
  waveBandColors,
} = usePalette();

const defaultWaveBandColors = [
  "#f4f6f8",
  "#eceff3",
  "#e5e9ee",
  "#dde3ea",
  "#d7dde6",
  "#cfd7e1",
];

const darkWaveBandColors = [
  "#1a2740",
  "#223552",
  "#2a4364",
  "#335175",
  "#3b5f86",
  "#446e97",
];

const theme = ref("light");

const isDarkTheme = computed(() => theme.value === "dark");

const applyTheme = (nextTheme) => {
  theme.value = nextTheme;
  if (!import.meta.client) return;
  document.documentElement.setAttribute("data-theme", nextTheme);
  localStorage.setItem("palettone-theme", nextTheme);
};

const toggleTheme = () => {
  applyTheme(isDarkTheme.value ? "light" : "dark");
};

const displayedWaveBandColors = computed(() =>
  hasGeneratedPalette.value
    ? waveBandColors.value
    : isDarkTheme.value
      ? darkWaveBandColors
      : defaultWaveBandColors,
);

const palettesStore = usePaletteStore();
const { savedPalettes } = storeToRefs(palettesStore);
const { loadSavedPalettes, savePalette, removePalette } = palettesStore;

const saveCurrentPalette = () => {
  if (!palette.value.length) return;
  savePalette(palette.value, currentDescription.value);
  markCurrentPaletteAsSaved();
  showToast("Palette saved");
};

onMounted(() => {
  if (import.meta.client) {
    const savedTheme = localStorage.getItem("palettone-theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const nextTheme =
      savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : preferredTheme;
    applyTheme(nextTheme);
  }
  loadSavedPalettes();
});
</script>

<style scoped lang="scss">
.page {
  position: relative;
  min-height: 100vh;
  isolation: isolate;

  &__shell {
    max-width: 900px;
    margin: 0 auto;
    padding: $space-4;
    min-height: 100vh;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: $space-3;
  }

  &__brand {
    position: relative;
    z-index: 1;
    margin: $space-4 0 0 $space-4;
    padding: 0;
    width: fit-content;
  }

  &__card {
    width: 100%;
  }

  &__card {
    background: var(--color-surface-soft);
    border: 1px solid var(--color-border-strong);
    border-radius: $radius-lg;
    box-shadow: $shadow-md;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    padding: $space-4;
  }

  &__error {
    color: $color-danger;
    text-align: center;
    margin: $space-4 0;
  }

  &__loading {
    text-align: center;
    margin: $space-3 0;
    color: var(--color-text-muted);
    font-weight: 500;
  }

  @include mq-up(md) {
    &__shell {
      padding: $space-6 $space-8 $space-8;
    }

    &__card {
      padding: $space-8;
    }
  }

}
</style>
