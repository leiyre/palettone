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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: $space-3;

  &__brand-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-3;
  }

  &__title {
    font-family: $font-display;
    margin: 0;
    font-size: clamp(1.5rem, 2.6vw, 2rem);
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
  width: 84px;
  margin: 0;
}
</style>
