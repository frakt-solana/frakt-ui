const icon = (
  <>
    <g opacity="0.6" filter="url(#filter0_f_4216_29762)">
      <ellipse cx="65" cy="153.5" rx="55" ry="5.5" fill="#5D5FEF" />
    </g>
    <g opacity="0.4" filter="url(#filter1_f_4216_29762)">
      <path
        d="M40 10H90L120 155H10L40 10Z"
        fill="url(#paint0_linear_4216_29762)"
      />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M65.0001 134.025C66.3056 133.306 68.1506 132.251 70.3587 130.883C74.9247 128.053 80.9928 123.914 87.0386 118.669C99.3284 108.006 110.572 93.6115 110.572 77.0006V36.6119L65.0001 19.667L19.4287 36.6119V77.0006C19.4287 93.6115 30.6719 108.006 42.9617 118.669C49.0075 123.914 55.0756 128.053 59.6416 130.883C61.8497 132.251 63.6947 133.306 65.0001 134.025Z"
      fill="#5D5FEF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M63.3447 10.2976C64.4119 9.90079 65.5881 9.90079 66.6553 10.2976L116.941 28.9954C118.781 29.6796 120 31.4237 120 33.3722V77.0004C120 97.785 106.1 114.553 93.2472 125.705C86.7216 131.366 80.2183 135.797 75.3557 138.811C72.9195 140.32 70.8826 141.482 69.4439 142.272C68.7243 142.667 68.1534 142.969 67.7561 143.176C67.5574 143.279 67.402 143.359 67.293 143.414L67.1647 143.479L67.1274 143.498L67.1155 143.504C67.1155 143.504 67.1083 143.507 65 139.326C62.8917 143.507 62.8887 143.506 62.8887 143.506L62.8726 143.498L62.8353 143.479L62.7069 143.414C62.598 143.359 62.4426 143.279 62.2439 143.176C61.8466 142.969 61.2757 142.667 60.5561 142.272C59.1174 141.482 57.0805 140.32 54.6443 138.811C49.7817 135.797 43.2784 131.366 36.7528 125.705C23.8997 114.553 10 97.785 10 77.0004V33.3722C10 31.4237 11.219 29.6796 13.059 28.9954L63.3447 10.2976ZM65 139.326L62.8887 143.506C64.2159 144.164 65.7811 144.165 67.1083 143.507L65 139.326ZM65 134.025C66.3054 133.306 68.1505 132.251 70.3586 130.883C74.9246 128.053 80.9926 123.914 87.0385 118.669C99.3282 108.006 110.571 93.6113 110.571 77.0004V36.6116L65 19.6668L19.4286 36.6116V77.0004C19.4286 93.6113 30.6718 108.006 42.9615 118.669C49.0074 123.914 55.0754 128.053 59.6414 130.883C61.8495 132.251 63.6946 133.306 65 134.025Z"
      fill="url(#paint1_linear_4216_29762)"
    />
    <defs>
      <filter
        id="filter0_f_4216_29762"
        x="5"
        y="143"
        width="120"
        height="21"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="2.5"
          result="effect1_foregroundBlur_4216_29762"
        />
      </filter>
      <filter
        id="filter1_f_4216_29762"
        x="0"
        y="0"
        width="130"
        height="165"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur
          stdDeviation="5"
          result="effect1_foregroundBlur_4216_29762"
        />
      </filter>
      <linearGradient
        id="paint0_linear_4216_29762"
        x1="65"
        y1="155"
        x2="65"
        y2="10"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5D5FEF" />
        <stop offset="1" stopColor="#5D5FEF" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_4216_29762"
        x1="65"
        y1="10"
        x2="65"
        y2="144"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#191919" />
        <stop offset="1" stopColor="#353535" />
      </linearGradient>
    </defs>
  </>
);

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const FraktGuardIcon = (props): JSX.Element => (
  <svg
    width="130"
    height="165"
    viewBox="0 0 130 165"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {icon}
  </svg>
);
