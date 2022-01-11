import React from 'react';

const icon = (
  <>
    <rect
      y="21.5625"
      width="30.494"
      height="2.03293"
      transform="rotate(-45 0 21.5625)"
      fill="white"
    />
    <rect
      x="1.4375"
      width="30.494"
      height="2.03293"
      transform="rotate(45 1.4375 0)"
      fill="white"
    />
  </>
);

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const CloseModalIcon = ({
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
    viewBox="0 0 23 23"
    width={width}
    height={height}
  >
    {icon}
  </svg>
);

export default CloseModalIcon;
