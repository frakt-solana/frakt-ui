import React from 'react';

const icon = (
  <>
    <rect width="25" height="25" rx="3" fill="transparent" />
    <rect
      x="5"
      y="13"
      width="1"
      height="15"
      transform="rotate(-90 5 13)"
      fill="white"
    />
    <rect
      x="12"
      y="20"
      width="15"
      height="1"
      transform="rotate(-90 12 20)"
      fill="white"
    />
  </>
);

export const PlusIcon = ({
  className,
  width,
  height,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '25'}
    height={height || '25'}
    viewBox="0 0 25 25"
    fill="none"
  >
    {icon}
  </svg>
);
