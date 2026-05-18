<template>
  <textarea
    :id="id"
    class="ui-textarea"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :aria-busy="busy ? 'true' : 'false'"
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
    modelValue: string;
    id?: string;
    placeholder?: string;
    disabled?: boolean;
    busy?: boolean;
  }>(),
  {
    id: undefined,
    placeholder: "",
    disabled: false,
    busy: false,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const onInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLTextAreaElement).value);
};
</script>

<style scoped lang="scss">
.ui-textarea {
  width: 100%;
  min-height: 110px;
  padding: $space-4;
  border: 1px solid var(--color-border);
  border-radius: $radius-lg;
  resize: vertical;
  color: var(--color-text);
  background: var(--color-surface);
}
</style>
