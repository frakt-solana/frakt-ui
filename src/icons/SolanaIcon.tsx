import React from 'react';

const icon = (
  <>
    <g clipPath="url(#clip0_993_4491)">
      <path
        d="M2.5989 10.9905C2.69546 10.8796 2.82822 10.8149 2.96903 10.8149H15.7385C15.9718 10.8149 16.0885 11.1383 15.9235 11.3277L13.401 14.2244C13.3045 14.3352 13.1717 14.3999 13.0309 14.3999H0.261461C0.0281185 14.3999 -0.0885525 14.0765 0.0763961 13.8871L2.5989 10.9905Z"
        fill="url(#paint0_linear_993_4491)"
      />
      <path
        d="M2.5989 0.175553C2.69948 0.0646776 2.83225 0 2.96903 0H15.7385C15.9718 0 16.0885 0.323388 15.9235 0.512801L13.401 3.40943C13.3045 3.52031 13.1717 3.58499 13.0309 3.58499H0.261461C0.0281185 3.58499 -0.0885525 3.2616 0.0763961 3.07218L2.5989 0.175553Z"
        fill="url(#paint1_linear_993_4491)"
      />
      <path
        d="M13.401 5.54836C13.3045 5.43748 13.1717 5.3728 13.0309 5.3728H0.261461C0.0281185 5.3728 -0.0885525 5.69619 0.0763961 5.8856L2.5989 8.78223C2.69546 8.89311 2.82822 8.95779 2.96903 8.95779H15.7385C15.9718 8.95779 16.0885 8.6344 15.9235 8.44499L13.401 5.54836Z"
        fill="url(#paint2_linear_993_4491)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_993_4491"
        x1="14.5186"
        y1="-1.73044"
        x2="3.60979"
        y2="16.4656"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_993_4491"
        x1="10.6544"
        y1="-4.04703"
        x2="-0.25443"
        y2="14.149"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_993_4491"
        x1="12.5742"
        y1="-2.89613"
        x2="1.66538"
        y2="15.2999"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#00FFA3" />
        <stop offset="1" stopColor="#DC1FFF" />
      </linearGradient>
      <clipPath id="clip0_993_4491">
        <rect width="16" height="14.4" fill="white" />
      </clipPath>
    </defs>
  </>
);

export const SolanaIcon = ({
  className,
  width,
  height,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '16'}
    height={height || '15'}
    viewBox="0 0 16 15"
    fill="none"
  >
    {icon}
  </svg>
);
