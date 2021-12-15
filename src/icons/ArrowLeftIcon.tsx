const icon = (
  <path
    d="M7.70711 0.292893C7.31658 -0.0976311 6.68342 -0.0976311 6.29289 0.292893L0.292893 6.29289C0.105357 6.48043 0 6.73478 0 7C0 7.26522 0.105357 7.51957 0.292893 7.70711L6.29289 13.7071C6.68342 14.0976 7.31658 14.0976 7.70711 13.7071C8.09763 13.3166 8.09763 12.6834 7.70711 12.2929L3.41421 8L15 8C15.5523 8 16 7.55229 16 7C16 6.44772 15.5523 6 15 6L3.41421 6L7.70711 1.70711C8.09763 1.31658 8.09763 0.683417 7.70711 0.292893Z"
    fill="white"
  />
);

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ArrowLeftIcon = (props): JSX.Element => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" {...props}>
    {icon}
  </svg>
);
