<template>
  <button
    class="ui-theme-toggle"
    type="button"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-pressed="isDark ? 'true' : 'false'"
    @click="emit('toggle')"
  >
    <span class="ui-theme-toggle__icon" aria-hidden="true">
      <Sun v-if="isDark" :size="14" />
      <Moon v-else :size="14" />
    </span>
    <span class="ui-theme-toggle__label">Theme</span>
    <span class="ui-theme-toggle__value">{{ isDark ? "Dark" : "Light" }}</span>
  </button>
</template>

<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";

declare const defineProps: <T>() => T;
declare const defineEmits: <T>() => T;

defineProps<{
  isDark: boolean;
}>();

const emit = defineEmits<{
  (event: "toggle"): void;
}>();
</script>

<style scoped lang="scss">
.ui-theme-toggle {
  position: fixed;
  top: $space-4;
  right: $space-4;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  border: 1px solid var(--color-border);
  background: var(--color-surface-soft);
  color: var(--color-text);
  border-radius: 999px;
  padding: $space-1 $space-3;
  box-shadow: $shadow-sm;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &:hover {
    background: var(--color-surface);
    border-color: var(--color-border);
  }

  &__label {
    font-size: 0.78rem;
    color: var(--color-text-muted);
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text);
  }

  &__value {
    font-size: 0.82rem;
    font-weight: 600;
  }
}
</style>
