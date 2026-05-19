<template>
  <section class="saved-palettes-list" aria-labelledby="saved-palettes-title">
    <h3 id="saved-palettes-title" class="saved-palettes-list__title">
      <BookmarkCheck class="saved-palettes-list__title-icon" aria-hidden="true" />
      <span>Your saved palettes</span>
    </h3>
    <ul class="saved-palettes-list__items">
      <li v-for="(item, idx) in palettes" :key="item.timestamp" class="saved-palettes-list__item">
        <div class="saved-palettes-list__colors" :aria-label="`Saved palette ${idx + 1} colors`">
          <button v-for="(color, colorIdx) in item.palette" :key="`${item.timestamp}-${color}-${colorIdx}`"
            class="saved-palettes-list__color-box" type="button" :style="{ backgroundColor: color }"
            :aria-label="`Apply saved palette ${idx + 1}, color ${color}`"
            :aria-describedby="`saved-description-${idx}`" @click="emit('apply-palette', item.palette)" />
        </div>
        <span :id="`saved-description-${idx}`" class="saved-palettes-list__description">
          {{ item.description }}
        </span>
        <button class="saved-palettes-list__delete-btn" type="button"
          :aria-label="`Delete saved palette ${idx + 1}: ${item.description}`" @click="emit('remove-palette', idx)">
          <Trash2 class="saved-palettes-list__delete-icon" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { BookmarkCheck, Trash2 } from "lucide-vue-next";
import type { SavedPalette } from "~/domain/palette";

declare const defineProps: <T>() => T;
declare const defineEmits: <T>() => T;

defineProps<{
  palettes: SavedPalette[];
}>();

const emit = defineEmits<{
  (event: "apply-palette", palette: string[]): void;
  (event: "remove-palette", index: number): void;
}>();
</script>

<style scoped lang="scss">
.saved-palettes-list {
  margin-top: $space-10;
  border-top: 1px solid var(--color-border);
  padding-top: $space-8;

  &__title {
    display: inline-flex;
    align-items: center;
    gap: $space-1;
  }

  &__title-icon {
    width: 1rem;
    height: 1rem;
  }

  &__item {
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: $space-3;
    margin: $space-2 0;
    padding: $space-3;
    border-radius: $radius-md;
    background-color: var(--color-surface);
    box-shadow: $shadow-sm;
  }

  &__colors {
    display: flex;
    flex-wrap: wrap;
    gap: $space-2;
  }

  &__items {
    margin: 0;
    padding: 0;
  }

  &__color-box {
    width: 28px;
    height: 28px;
    border-radius: $radius-sm;
    cursor: pointer;
    border: 1px solid var(--color-border);
  }

  &__description {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  &__delete-btn {
    color: var(--color-text-muted);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: $radius-sm;
    line-height: 1;
    align-self: flex-end;
  }

  &__delete-icon {
    width: 1.1rem;
    height: 1.1rem;
  }

  @include mq-up(lg) {
    &__item {
      flex-direction: row;
      align-items: center;
      gap: 0;
    }

    &__colors {
      flex-wrap: nowrap;
      margin-right: $space-4;
    }

    &__color-box {
      width: 30px;
      height: 30px;
    }

    &__description {
      flex-grow: 1;
    }

    &__delete-btn {
      align-self: center;
    }
  }
}
</style>
