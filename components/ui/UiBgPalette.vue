<template>
  <svg
    class="ui-bg-palette"
    :class="{ 'ui-bg-palette--idle': idle }"
    viewBox="0 0 680 420"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <defs>
      <filter id="mesh-organic" x="-25%" y="-25%" width="150%" height="150%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008"
          numOctaves="2"
          seed="9"
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="26" xChannelSelector="R" yChannelSelector="G" />
        <feGaussianBlur stdDeviation="34" />
      </filter>

      <radialGradient
        v-for="(_, index) in colors"
        :id="`mesh-grad-${index}`"
        :key="`mesh-grad-${index}`"
        cx="50%"
        cy="50%"
        r="55%"
      >
        <stop offset="0%" :stop-color="colors[index]" stop-opacity="0.98" />
        <stop offset="56%" :stop-color="colors[index]" stop-opacity="0.58" />
        <stop offset="100%" :stop-color="colors[index]" stop-opacity="0" />
      </radialGradient>
    </defs>

    <rect width="680" height="420" :fill="colors[0]" opacity="0.32" />

    <g filter="url(#mesh-organic)">
      <ellipse cx="95" cy="70" rx="210" ry="150" fill="url(#mesh-grad-0)" transform="rotate(-11 95 70)" />
      <ellipse cx="420" cy="40" rx="235" ry="145" fill="url(#mesh-grad-1)" transform="rotate(8 420 40)" />
      <ellipse cx="655" cy="170" rx="210" ry="185" fill="url(#mesh-grad-2)" transform="rotate(-9 655 170)" />
      <ellipse cx="535" cy="372" rx="255" ry="165" fill="url(#mesh-grad-3)" transform="rotate(6 535 372)" />
      <ellipse cx="218" cy="356" rx="268" ry="175" fill="url(#mesh-grad-4)" transform="rotate(-13 218 356)" />
      <ellipse cx="-15" cy="230" rx="220" ry="205" fill="url(#mesh-grad-5)" transform="rotate(9 -15 230)" />
    </g>
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

.ui-bg-palette ellipse,
.ui-bg-palette stop,
.ui-bg-palette rect {
  transition: fill 0.45s ease, stop-color 0.45s ease;
}
</style>
