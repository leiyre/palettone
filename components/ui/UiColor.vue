<template>
  <button class="ui-color" type="button" :style="{ backgroundColor: color }" :aria-label="`Copy color ${color}`"
    @click="emit('copy', color)">
    <span class="ui-color__value">
      {{ color }}
    </span>
    <span class="ui-color__copy-hint" aria-hidden="true">
      <Copy class="ui-color__copy-icon" />
      <span>Click to copy</span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { Copy } from "lucide-vue-next";

declare const defineProps: <T>() => T;
declare const defineEmits: <T>() => T;

defineProps<{
  color: string;
}>();

const emit = defineEmits<{
  (event: "copy", color: string): void;
}>();
</script>

<style scoped lang="scss">
.ui-color {
  width: 100%;
  max-width: 132px;
  aspect-ratio: 1 / 1;
  flex: 0 0 auto;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: $space-4;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: $shadow-sm;
  transition: transform 0.2s ease, background-color 0.35s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &:hover .ui-color__copy-hint,
  &:focus-visible .ui-color__copy-hint {
    bottom: $space-2;
    opacity: 1;
  }

  &__value {
    color: var(--color-hex-chip-text);
    background-color: var(--color-hex-chip-bg);
    padding: $space-1 $space-2;
    border-radius: 999px;
    font-size: 0.8rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }

  &__copy-hint {
    position: absolute;
    bottom: -22px;
    opacity: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    transition: all 0.2s ease;
    font-size: 0.75rem;
    background: var(--color-overlay);
    color: var(--color-toast-text);
    padding: $space-1 $space-2;
    border-radius: $radius-sm;
  }

  &__copy-icon {
    width: 0.9rem;
    height: 0.9rem;
  }

  @include mq-up(lg) {
    width: 120px;
    max-width: none;
    flex: 0 0 120px;
  }
}
</style>
