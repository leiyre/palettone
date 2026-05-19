<template>
  <header class="app-header" :aria-labelledby="headingId">
    <div class="app-header__brand-row">
      <MainLogo />
      <h1 :id="headingId" class="app-header__title">{{ title }}</h1>
    </div>
    <h2 v-if="showSubtitleTitle" class="app-header__subtitle-title">{{ subtitleTitle }}</h2>
    <p v-if="showSubtitle" class="app-header__subtitle">{{ subtitle }}</p>
  </header>
</template>

<script lang="ts">
export default {
  name: "AppHeader",
  props: {
    title: {
      type: String,
      default: "Palettone",
    },
    headingId: {
      type: String,
      default: "page-title",
    },
    subtitleTitle: {
      type: String,
      default: "Color Palette Generator",
    },
    subtitle: {
      type: String,
      default: "Describe a scene and get a harmonious palette",
    },
    showSubtitleTitle: {
      type: Boolean,
      default: false,
    },
    showSubtitle: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.app-header {
  --brand-logo-size: clamp(56px, 7.2vw, 84px);
  --brand-title-size: calc(var(--brand-logo-size) * 0.38);

  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: $space-3;

  &__brand-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: calc(var(--brand-logo-size) * 0.18);
  }

  &__title {
    font-family: $font-display;
    margin: 0;
    font-size: var(--brand-title-size);
    line-height: 1.05;
    text-shadow: 0 0 6px rgba(255, 255, 255, 0.45);
  }

  &__subtitle-title {
    margin: $space-2 0 0;
  }

  &__subtitle {
    color: $color-text-muted;
    margin: $space-2 0 0;
  }
}

:deep(.main-logo) {
  width: var(--brand-logo-size);
  margin: 0;
}
</style>
