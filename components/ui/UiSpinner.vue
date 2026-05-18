<template>
  <span
    class="ui-spinner"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
declare const defineProps: <T>() => T;
declare const withDefaults: <T, D extends Partial<T>>(
  props: T,
  defaults: D,
) => T & D;

withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 18,
  },
);
</script>

<style scoped lang="scss">
.ui-spinner {
  display: inline-block;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    #ef4444 0%,
    #f59e0b 22%,
    #22c55e 44%,
    #06b6d4 66%,
    #8b5cf6 82%,
    #ef4444 100%
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0);
  animation: ui-spinner-rotate 0.9s linear infinite;
}

@keyframes ui-spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
