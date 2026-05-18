<template>
  <Transition name="ui-toast-fade">
    <div v-if="message" class="ui-toast" role="status" aria-live="polite" aria-atomic="true">
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
declare const defineProps: <T>() => T;

defineProps<{
  message: string | null;
}>();
</script>

<style scoped lang="scss">
.ui-toast {
  position: fixed;
  right: $space-6;
  bottom: $space-6;
  z-index: 30;
  max-width: min(420px, calc(100vw - #{$space-8}));
  padding: $space-3 $space-4;
  border-radius: $radius-md;
  background: var(--color-toast-bg);
  color: var(--color-toast-text);
  box-shadow: $shadow-md;
  font-size: 0.92rem;
  font-weight: 600;
}

.ui-toast-fade-enter-active,
.ui-toast-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.ui-toast-fade-enter-from,
.ui-toast-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
