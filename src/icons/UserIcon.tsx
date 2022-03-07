import React from 'react';

const icon = (
  <>
    <circle cx="25" cy="25" r="24.5" fill="#191919" stroke="#4D4D4D" />
    <circle cx="25" cy="21" r="10" fill="#4D4D4D" />
    <path
      d="M25.0001 31C17.4386 31 10.7681 34.8148 6.80811 40.6247C6.80811 40.6247 13.0005 49 25.0001 49C36.9996 49 43.192 40.6247 43.192 40.6247C39.232 34.8148 32.5615 31 25.0001 31Z"
      fill="#4D4D4D"
    />
  </>
);

export const UserIcon = ({
  className,
  width,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '50'}
    viewBox="0 0 50 50"
    fill="none"
  >
    {icon}
  </svg>
);
