<template>
  <details class="ui-trace">
    <summary class="ui-trace__summary">{{ summaryLabel }}</summary>
    <div class="ui-trace__content">
      <slot />
    </div>
  </details>
</template>

<script setup lang="ts">
declare const defineProps: <T>() => T;
declare const withDefaults: <T, D extends Partial<T>>(
  props: T,
  defaults: D,
) => T & D;

withDefaults(
  defineProps<{
    summaryLabel?: string;
  }>(),
  {
    summaryLabel: "Trace",
  },
);
</script>

<style scoped lang="scss">
.ui-trace {
  margin: $space-3 0 0;
  padding: $space-2 $space-3;
  border: 1px dashed var(--color-border);
  border-radius: $radius-md;
  background: color-mix(in srgb, var(--color-surface), transparent 36%);
  opacity: 0.82;

  &__summary {
    cursor: pointer;
    color: var(--color-text-muted);
    font-size: 0.8rem;
    font-weight: 500;
    user-select: none;
  }

  &[open] &__summary {
    margin-bottom: $space-2;
  }
}

.ui-trace__content :deep(.ui-trace__total) {
  margin-top: 0;
  margin-bottom: $space-2;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.ui-trace__content :deep(.ui-trace__meta) {
  margin: 0 0 $space-2;
  padding-left: 1.1rem;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.ui-trace__content :deep(.ui-trace__list) {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
