import React from 'react';

const icon = (
  <>
    <rect x="10.5" y="10.5" width="229" height="99" stroke="#5D5FEF" />
    <circle cx="125" cy="45" r="24.5" stroke="#5D5FEF" />
    <path
      d="M76.1042 109.5C80.9282 86.9272 100.987 70 125 70C149.013 70 169.072 86.9272 173.896 109.5"
      stroke="#5D5FEF"
    />
    <rect
      x="42.25"
      y="0.25"
      width="0.5"
      height="119.5"
      stroke="#5D5FEF"
      strokeWidth="0.5"
      strokeDasharray="6 6"
    />
    <rect
      x="108.25"
      y="0.25"
      width="0.5"
      height="119.5"
      stroke="#5D5FEF"
      strokeWidth="0.5"
      strokeDasharray="6 6"
    />
    <rect
      x="174.25"
      y="0.25"
      width="0.5"
      height="119.5"
      stroke="#5D5FEF"
      strokeWidth="0.5"
      strokeDasharray="6 6"
    />
    <rect
      x="75.25"
      y="0.25"
      width="0.5"
      height="119.5"
      stroke="#5D5FEF"
      strokeWidth="0.5"
      strokeDasharray="6 6"
    />
    <rect
      x="141.25"
      y="0.25"
      width="0.5"
      height="119.5"
      stroke="#5D5FEF"
      strokeWidth="0.5"
      strokeDasharray="6 6"
    />
    <rect
      x="207.25"
      y="0.25"
      width="0.5"
      height="119.5"
      stroke="#5D5FEF"
      strokeWidth="0.5"
      strokeDasharray="6 6"
    />
    <rect
      x="0.25"
      y="76.75"
      width="0.5"
      height="249.5"
      transform="rotate(-90 0.25 76.75)"
      stroke="#5D5FEF"
      strokeWidth="0.5"
      strokeDasharray="6 6"
    />
    <rect
      x="0.25"
      y="43.75"
      width="0.5"
      height="249.5"
      transform="rotate(-90 0.25 43.75)"
      stroke="#5D5FEF"
      strokeWidth="0.5"
      strokeDasharray="6 6"
    />
  </>
);

export const FraktionalizationInfoIcon = ({
  className,
  width,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '250'}
    viewBox="0 0 250 120"
    fill="none"
  >
    {icon}
  </svg>
);
