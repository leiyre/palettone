<template>
  <select
    :id="id"
    class="ui-selector"
    :value="modelValue"
    :disabled="disabled"
    @change="onChange"
  >
    <option
      v-for="option in options"
      :key="option"
      :value="option"
    >
      {{ option }}
    </option>
  </select>
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
    modelValue: string;
    options: string[];
    id?: string;
    disabled?: boolean;
  }>(),
  {
    id: undefined,
    disabled: false,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const onChange = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLSelectElement).value);
};
</script>

<style scoped lang="scss">
.ui-selector {
  width: 100%;
  padding: $space-3;
  border: 1px solid var(--color-border);
  border-radius: $radius-md;
  color: var(--color-text);
  background: var(--color-surface);
}
</style>
