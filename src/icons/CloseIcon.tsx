import React from 'react';

const icon = (
  <path
    d="M0.585786 0.585787C1.36683 -0.195262 2.63316 -0.195262 3.41421 0.585787L14 11.1716L24.5858 0.585787C25.3668 -0.195262 26.6332 -0.195262 27.4142 0.585787C28.1953 1.36684 28.1953 2.63317 27.4142 3.41421L16.8284 14L27.4142 24.5858C28.1953 25.3668 28.1953 26.6332 27.4142 27.4142C26.6332 28.1953 25.3668 28.1953 24.5858 27.4142L14 16.8284L3.41421 27.4142C2.63316 28.1953 1.36683 28.1953 0.585786 27.4142C-0.195262 26.6332 -0.195262 25.3668 0.585786 24.5858L11.1716 14L0.585786 3.41421C-0.195262 2.63317 -0.195262 1.36684 0.585786 0.585787Z"
    fill="white"
  />
);

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const CloseIcon = ({
  className,
  fill,
  stroke,
  width,
  height,
}: any): JSX.Element => (
  <svg
    className={className || ''}
    fill={fill || '#FFFFFF'}
    stroke={stroke || 'none'}
    viewBox="0 0 28 28"
    width={width}
    height={height}
  >
    {icon}
  </svg>
);

export default CloseIcon;
