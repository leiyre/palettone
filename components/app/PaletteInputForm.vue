<template>
  <form class="palette-input-form" aria-labelledby="palette-description-label" @submit.prevent="emit('submit')">
    <label id="palette-description-label" class="palette-input-form__label" for="palette-description">
      Describe the scene or mood for your palette
    </label>
    <UiTextarea id="palette-description" :model-value="modelValue" class="palette-input-form__textarea"
      placeholder="Sunset on the beach with golden and violet tones." :disabled="isLoading" :busy="isLoading"
      @update:model-value="emit('update:modelValue', $event)" />
    <div class="palette-input-form__actions">
      <div class="palette-input-form__harmony-field">
        <label class="palette-input-form__harmony-label" for="harmony-select">
          <Blend class="palette-input-form__label-icon" aria-hidden="true" />
          <span>Harmony</span>
        </label>
        <UiSelector id="harmony-select" class="palette-input-form__harmony-select" :model-value="harmony"
          :options="harmonyOptions" :disabled="isLoading" @update:model-value="emit('update:harmony', $event)" />
      </div>
      <UiButton class="palette-input-form__generate-btn" type="submit" variant="primary" :loading="isLoading"
        :aria-label="isLoading ? 'Generating palette' : 'Generate palette'">
        <template #icon>
          <UiSpinner v-if="isLoading" :size="16" />
          <WandSparkles v-else class="palette-input-form__btn-icon" aria-hidden="true" />
        </template>
        <span>{{ isLoading ? "Generating palette" : "Generate Palette" }}</span>
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Blend, WandSparkles } from "lucide-vue-next";

declare const defineProps: <T>() => T;
declare const defineEmits: <T>() => T;

defineProps<{
  modelValue: string;
  isLoading: boolean;
  harmony: string;
  harmonyOptions: string[];
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
  (event: "update:harmony", value: string): void;
  (event: "submit"): void;
}>();

</script>

<style scoped lang="scss">
.palette-input-form {
  &__label {
    display: block;
    font-weight: 600;
    margin-bottom: $space-2;
  }

  &__textarea {
    margin-bottom: $space-4;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: $space-3;
  }

  &__harmony-field {
    margin-bottom: 0;
    text-align: left;
    width: 100%;
  }

  &__harmony-label {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
    font-weight: 600;
    margin-bottom: $space-2;
  }

  &__label-icon {
    width: 0.95rem;
    height: 0.95rem;
  }

  &__harmony-select {
    width: 100%;
  }

  &__btn-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &__generate-btn {
    width: 100%;
  }

  @include mq-up(lg) {
    &__actions {
      flex-direction: row;
      align-items: flex-end;
    }

    &__harmony-field {
      flex: 1;
    }

    &__generate-btn {
      width: auto;
    }
  }
}
</style>
