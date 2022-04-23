import React from 'react';

const icon = (
  <path
    d="M17.1529 8.14027L17.9741 7.32666C18.3809 6.91985 18.3959 6.47537 18.0268 6.0987L17.733 5.79736C17.3638 5.42822 16.9043 5.46589 16.505 5.86516L15.6839 6.67124L17.1529 8.14027ZM7.92439 17.3537L16.4297 8.84842L14.9682 7.39446L6.46289 15.8847L5.72461 17.6626C5.64174 17.8886 5.87528 18.1372 6.10128 18.0543L7.92439 17.3537Z"
    fill="white"
  />
);

export const PencilIcon = ({
  className,
  width,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '24'}
    viewBox="0 0 24 24"
    fill="#5D5FEF"
  >
    <circle cx="12" cy="12" r="12" fill="#5D5FEF" />
    {icon}
  </svg>
);
