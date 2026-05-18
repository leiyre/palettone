<template>
  <input
    :id="id"
    class="ui-slider"
    type="range"
    :value="modelValue"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :aria-valuetext="ariaValueText"
    @input="onInput"
  />
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
    modelValue: number;
    min?: number;
    max?: number;
    step?: number;
    id?: string;
    disabled?: boolean;
    ariaValueText?: string;
  }>(),
  {
    min: 0,
    max: 1,
    step: 0.01,
    id: undefined,
    disabled: false,
    ariaValueText: undefined,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: number): void;
}>();

const onInput = (event: Event) => {
  emit("update:modelValue", Number((event.target as HTMLInputElement).value));
};
</script>

<style scoped lang="scss">
.ui-slider {
  width: 100%;
  margin-bottom: 0;
}
</style>
