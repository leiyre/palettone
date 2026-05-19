<template>
  <svg
    class="main-logo"
    width="340"
    height="374"
    viewBox="0 0 340 374"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M27.5049 68.9996C88.1284 -22.1761 245.331 1.64251 293.505 57.9996C342.242 115.015 315.505 178 286.505 165L261.505 366H54.5049L40.505 160C11.505 170 -8.81752 123.627 27.5049 68.9996Z"
      fill="#E49144"
    />
    <path
      d="M21.6076 63.4335C54.1603 15.5495 111.401 -1.45733 165.415 0.178634C219.607 1.82009 273.508 22.2937 299.586 52.8017L300.781 54.2177C325.578 83.9912 331.67 115.797 327.003 139.312C324.656 151.138 319.452 161.408 311.879 167.869C306.574 172.394 300.153 174.942 293.358 174.712L268.571 374H47.0304L33.1222 169.359C27.1504 169.441 21.4753 167.69 16.5412 164.233C9.13027 159.041 4.14523 150.559 1.73452 140.621C-3.09369 120.717 1.80981 93.1955 20.8429 64.5702L21.6076 63.4335ZM164.931 16.1708C113.972 14.6274 63.1747 30.7504 34.8322 72.4394L34.1671 73.4286C16.8779 99.431 13.7809 122.411 17.2833 136.85C19.038 144.083 22.3013 148.733 25.7218 151.13C28.9209 153.371 32.9307 154.149 37.8966 152.436L47.7775 149.029L61.9796 358H254.439L279.902 153.272L289.777 157.699C293.886 159.541 297.74 158.899 301.494 155.696C305.567 152.222 309.439 145.62 311.309 136.198C314.944 117.882 310.507 90.8937 288.486 64.456L287.424 63.1972C265.328 37.3483 216.539 17.734 164.931 16.1708Z"
      fill="#C7701F"
    />
    <path
      d="M297.505 164.928C326.505 177.928 353.242 114.943 304.505 57.9279C278.649 27.6802 221.386 6.80566 164.505 8.05257V365.928H272.505L297.505 164.928Z"
      fill="#F2C679"
    />
    <path
      d="M165.709 0.0288657C194.682 -0.430839 223.67 4.62174 248.84 13.649C274.304 22.7819 296.46 36.2041 310.586 52.73L311.781 54.1461C336.578 83.9195 342.67 115.725 338.003 139.241C335.656 151.066 330.452 161.337 322.879 167.797C317.574 172.323 311.153 174.87 304.357 174.64L279.571 373.928H156.505V0.226131L164.329 0.0542564L165.709 0.0288657ZM172.505 357.928H265.439L290.901 153.201L300.777 157.628C304.885 159.469 308.74 158.827 312.494 155.625C316.567 152.15 320.44 145.549 322.31 136.127C325.945 117.81 321.507 90.8221 299.485 64.3843L298.424 63.1255C286.695 49.4039 267.29 37.265 243.439 28.7105C221.949 21.003 197.334 16.384 172.505 16.022V357.928Z"
      fill="#E49144"
    />
    <ellipse class="main-logo__dot main-logo__dot--1" cx="211.505" cy="142.5" rx="12" ry="10.5" />
    <ellipse class="main-logo__dot main-logo__dot--2" cx="287.505" cy="116.5" rx="12" ry="10.5" />
    <ellipse class="main-logo__dot main-logo__dot--3" cx="199.505" cy="224.5" rx="12" ry="10.5" />
    <ellipse class="main-logo__dot main-logo__dot--4" cx="251.505" cy="184.5" rx="13" ry="11.5" />
    <ellipse class="main-logo__dot main-logo__dot--5" cx="231.505" cy="273" rx="9" ry="8" />
    <ellipse class="main-logo__dot main-logo__dot--6" cx="254.505" cy="225" rx="16" ry="14" />
    <ellipse class="main-logo__dot main-logo__dot--7" cx="211.505" cy="64.9996" rx="16" ry="14" />
    <ellipse class="main-logo__dot main-logo__dot--8" cx="199.505" cy="323" rx="16" ry="14" />
    <ellipse class="main-logo__dot main-logo__dot--9" cx="106.505" cy="126.5" rx="12" ry="10.5" />
    <ellipse class="main-logo__dot main-logo__dot--10" cx="121.505" cy="68.4996" rx="12" ry="10.5" />
    <ellipse class="main-logo__dot main-logo__dot--11" cx="77.5049" cy="224.5" rx="12" ry="10.5" />
    <ellipse class="main-logo__dot main-logo__dot--12" cx="138.505" cy="311.5" rx="13" ry="11.5" />
    <ellipse class="main-logo__dot main-logo__dot--13" cx="57.5049" cy="116" rx="16" ry="14" />
    <ellipse class="main-logo__dot main-logo__dot--14" cx="117.005" cy="248" rx="10.5" ry="9" />
    <ellipse class="main-logo__dot main-logo__dot--15" cx="149.505" cy="167" rx="16" ry="14" />
    <ellipse class="main-logo__dot main-logo__dot--16" cx="76.0049" cy="337" rx="10.5" ry="9" />
  </svg>
</template>

<style scoped lang="scss">
.main-logo {
  display: block;
  width: 180px;
  height: auto;
  margin: 0 auto 0.8rem;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.16));

  &__dot {
    fill: #ed5050;
    animation: main-logo-dot-color-cycle 4.8s ease-in-out infinite;
    animation-fill-mode: both;
  }

  &__dot--1 {
    animation-delay: 0s;
  }
  &__dot--2 {
    animation-delay: 0.3s;
  }
  &__dot--3 {
    animation-delay: 0.6s;
  }
  &__dot--4 {
    animation-delay: 0.9s;
  }
  &__dot--5 {
    animation-delay: 1.2s;
  }
  &__dot--6 {
    animation-delay: 1.5s;
  }
  &__dot--7 {
    animation-delay: 1.8s;
  }
  &__dot--8 {
    animation-delay: 2.1s;
  }
  &__dot--9 {
    animation-delay: 2.4s;
  }
  &__dot--10 {
    animation-delay: 2.7s;
  }
  &__dot--11 {
    animation-delay: 3s;
  }
  &__dot--12 {
    animation-delay: 3.3s;
  }
  &__dot--13 {
    animation-delay: 3.6s;
  }
  &__dot--14 {
    animation-delay: 3.9s;
  }
  &__dot--15 {
    animation-delay: 4.2s;
  }
  &__dot--16 {
    animation-delay: 4.5s;
  }
}

@keyframes main-logo-dot-color-cycle {
  0% {
    fill: #ed5050;
  }
  25% {
    fill: #508ced;
  }
  50% {
    fill: #4fcb26;
  }
  75% {
    fill: #e5338f;
  }
  100% {
    fill: #ed5050;
  }
}
</style>
