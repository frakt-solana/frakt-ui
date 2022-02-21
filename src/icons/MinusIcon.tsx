import React from 'react';

const icon = (
  <>
    <rect width="25" height="25" rx="3" fill="transparent" />
    <path d="M5 13V12H20V13L5 13Z" fill="white" />
  </>
);

export const MinusIcon = ({
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
