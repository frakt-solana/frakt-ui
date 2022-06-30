import React from 'react';

const icon = (
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.6 0.8L4.8 0H0V16H4.8L5.6 15.2H6.4L7.2 16H24V0H7.2L6.4 0.8H5.6ZM7.86274 1.6L7.06274 2.4H4.93726L4.13726 1.6H1.6V14.4H4.13726L4.93726 13.6H7.06274L7.86274 14.4H22.4V1.6H7.86274Z"
      fill="#5D5FEF"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.59961 15.2008V14.4008H5.79961V14.4808H6.19961V14.4008H6.39961V15.2008H5.59961ZM6.39961 13.0408V11.6008L5.59961 11.6008V13.0408H6.39961ZM5.59961 10.1608H6.39961V8.72078L5.59961 8.72078V10.1608ZM5.59961 7.28078L6.39961 7.28078V5.84078L5.59961 5.84078V7.28078ZM5.59961 4.40078L6.39961 4.40078V2.96078L5.59961 2.96078V4.40078ZM5.59961 1.60078H5.79961V1.52078H6.19961V1.60078H6.39961V0.800781H5.59961V1.60078Z"
      fill="#5D5FEF"
    />
  </>
);

export const Ticket = ({
  className,
  width,
  ...props
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '24'}
    height="16"
    viewBox="0 0 24 16"
    {...props}
  >
    {icon}
  </svg>
);
