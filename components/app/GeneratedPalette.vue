<template>
  <section class="generated-palette" aria-labelledby="generated-palette-title">
    <h2 id="generated-palette-title" class="generated-palette__sr-only">Generated palette</h2>
    <div class="generated-palette__controls">
      <div class="generated-palette__control-group">
        <label class="generated-palette__label" for="emotion-select">
          <SmilePlus class="generated-palette__label-icon" aria-hidden="true" />
          <span>Emotion</span>
        </label>
        <UiSelector id="emotion-select" class="generated-palette__select" :model-value="emotion"
          :options="emotionOptions" @update:model-value="emit('update:emotion', $event)" />
      </div>
      <div class="generated-palette__control-group generated-palette__control-group--range">
        <label class="generated-palette__label" for="intensity-range">
          <Gauge class="generated-palette__label-icon" aria-hidden="true" />
          <span>Intensity: {{ Math.round(emotionIntensity * 100) }}%</span>
        </label>
        <UiSlider id="intensity-range" class="generated-palette__range" :model-value="emotionIntensity"
          :aria-valuetext="`${Math.round(emotionIntensity * 100)} percent`"
          @update:model-value="emit('update:emotion-intensity', $event)" />
      </div>
    </div>

    <ul class="generated-palette__list" aria-label="Generated colors">
      <li v-for="(color, index) in palette" :key="`${color}-${index}`" class="generated-palette__item">
        <UiColor :color="color" @copy="emit('copy-color', $event)" />
      </li>
    </ul>

    <div v-if="!saved" class="generated-palette__actions">
      <UiButton variant="accent" @click="emit('save-palette')">
        <template #icon>
          <BookmarkPlus class="generated-palette__action-icon" aria-hidden="true" />
        </template>
        <span>Save palette</span>
      </UiButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BookmarkPlus, Gauge, SmilePlus } from "lucide-vue-next";

declare const defineProps: <T>() => T;
declare const defineEmits: <T>() => T;

defineProps<{
  palette: string[];
  emotion: string;
  emotionOptions: string[];
  emotionIntensity: number;
  saved: boolean;
}>();

const emit = defineEmits<{
  (event: "copy-color", color: string): void;
  (event: "update:emotion", value: string): void;
  (event: "update:emotion-intensity", value: number): void;
  (event: "save-palette"): void;
}>();

</script>

<style scoped lang="scss">
.generated-palette {
  margin-top: $space-8;
  text-align: center;

  &__sr-only {
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }

  &__controls {
    margin: 0 auto $space-4;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    align-items: stretch;
    gap: $space-3;
  }

  &__control-group {
    min-width: 0;
    width: 100%;
    text-align: left;

    &--range {
      min-width: 0;
    }
  }

  &__label {
    display: flex;
    align-items: center;
    gap: $space-1;
    width: 100%;
    white-space: normal;
    line-height: 1.25;
    margin: 0 0 $space-1;
    font-size: 0.82rem;
    color: var(--color-text-muted);
  }

  &__label-icon,
  &__action-icon {
    width: 0.9rem;
    height: 0.9rem;
  }

  &__select,
  &__range {
    width: 100%;
    margin-bottom: 0;
  }

  &__select {
    width: 100%;
  }

  &__list {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $space-3;
    margin: $space-8 0;
    justify-items: center;
  }

  &__item {
    margin: 0;
    width: 100%;
    max-width: 132px;
  }

  &__actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: $space-3;
    margin-top: $space-4;
  }

  @include mq-up(lg) {
    &__controls {
      display: flex;
      align-items: flex-end;
      gap: $space-3;
      flex-wrap: nowrap;
    }

    &__control-group {
      min-width: 170px;
      flex: 1;

      &--range {
        min-width: 260px;
        flex: 1.6;
      }
    }

    &__label {
      white-space: nowrap;
    }

    &__list {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      gap: $space-3;
    }

    &__item {
      width: auto;
      max-width: none;
    }
  }

}
</style>
