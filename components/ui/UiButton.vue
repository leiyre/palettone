<template>
  <button
    class="ui-button"
    :class="[
      `ui-button--${variant}`,
      `ui-button--${size}`,
      { 'ui-button--full-width': fullWidth },
    ]"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : 'false'"
    @click="onClick"
  >
    <span v-if="$slots.icon" class="ui-button__icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="ui-button__label">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
declare const defineProps: <T>() => T;
declare const withDefaults: <T, D extends Partial<T>>(
  props: T,
  defaults: D,
) => T & D;
declare const defineEmits: <T>() => T;

withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset";
    variant?: "primary" | "accent" | "ghost";
    size?: "sm" | "md";
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
  }>(),
  {
    type: "button",
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
    fullWidth: false,
  },
);

const emit = defineEmits<{
  (event: "click", payload: MouseEvent): void;
}>();

const onClick = (event: MouseEvent) => {
  emit("click", event);
};
</script>

<style scoped lang="scss">
.ui-button {
  border: 1px solid transparent;
  border-radius: $radius-md;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  &--full-width {
    width: 100%;
  }

  &--sm {
    padding: $space-2 $space-3;
    font-size: 0.84rem;
  }

  &--md {
    padding: $space-3 $space-6;
    font-size: 0.92rem;
  }

  &--primary {
    background-color: $color-primary;
    color: $color-surface;

    &:hover:not(:disabled) {
      background-color: $color-primary-dark;
      transform: translateY(-1px);
    }
  }

  &--accent {
    background-color: var(--color-action-bg);
    color: var(--color-action-text);
    border-color: var(--color-action-border);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.28);

    &:hover:not(:disabled) {
      background-color: var(--color-action-bg-hover);
      border-color: var(--color-action-border-hover);
      transform: translateY(-1px);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--color-text);
    border-color: var(--color-border);

    &:hover:not(:disabled) {
      background: var(--color-surface-soft);
    }
  }
}
</style>
