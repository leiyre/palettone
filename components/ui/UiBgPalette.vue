<template>
  <svg
    class="ui-bg-palette"
    :class="{ 'ui-bg-palette--idle': idle }"
    viewBox="0 0 680 420"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <path
      d="M0,0 L680,0 L680,80 Q510,120 340,70 Q170,20 0,90 Z"
      :fill="colors[0]"
      :stroke="colors[0]"
      stroke-width="1"
      stroke-linejoin="round"
    />
    <path
      d="M0,90 Q170,20 340,70 Q510,120 680,80 L680,155 Q510,195 340,145 Q170,95 0,165 Z"
      :fill="colors[1]"
      :stroke="colors[1]"
      stroke-width="1"
      stroke-linejoin="round"
    />
    <path
      d="M0,165 Q170,95 340,145 Q510,195 680,155 L680,235 Q510,275 340,225 Q170,175 0,245 Z"
      :fill="colors[2]"
      :stroke="colors[2]"
      stroke-width="1"
      stroke-linejoin="round"
    />
    <path
      d="M0,245 Q170,175 340,225 Q510,275 680,235 L680,315 Q510,355 340,305 Q170,255 0,325 Z"
      :fill="colors[3]"
      :stroke="colors[3]"
      stroke-width="1"
      stroke-linejoin="round"
    />
    <path
      d="M0,325 Q170,255 340,305 Q510,355 680,315 L680,390 Q510,430 340,380 Q170,330 0,400 Z"
      :fill="colors[4]"
      :stroke="colors[4]"
      stroke-width="1"
      stroke-linejoin="round"
    />
    <path
      d="M0,400 Q170,330 340,380 Q510,430 680,390 L680,420 L0,420 Z"
      :fill="colors[5]"
      :stroke="colors[5]"
      stroke-width="1"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: "UiBgPalette",
  props: {
    colors: {
      type: Array,
      required: true,
    },
    idle: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
.ui-bg-palette {
  position: fixed;
  inset: 0;
  display: block;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  opacity: 0.72;
  shape-rendering: geometricPrecision;
  pointer-events: none;

  &--idle {
    opacity: 0.62;
  }
}

.ui-bg-palette path {
  transition: fill 0.4s ease, stroke 0.4s ease;
}
</style>
