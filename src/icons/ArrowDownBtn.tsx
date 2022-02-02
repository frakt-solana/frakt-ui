import React from 'react';

const icon = (
  <path
    d="M0.528636 0.195262C0.788986 -0.0650874 1.2111 -0.0650874 1.47145 0.195262L5.00004 3.72386L8.52864 0.195262C8.78899 -0.0650874 9.2111 -0.0650874 9.47145 0.195262C9.7318 0.455612 9.7318 0.877722 9.47145 1.13807L5.47145 5.13807C5.2111 5.39842 4.78899 5.39842 4.52864 5.13807L0.528636 1.13807C0.268287 0.877722 0.268287 0.455612 0.528636 0.195262Z"
    fill="white"
  />
);

export const ArrowDownBtn = ({
  className,
  width,
  height,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '10'}
    height={height || '6'}
    viewBox="0 0 10 6"
    fill="none"
  >
    {icon}
  </svg>
);
