const icon = (
  <>
    <path
      d="M8 13.1665V3.83317"
      stroke="#5D5FEF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.6663 8.5L7.99967 3.83333L3.33301 8.5"
      stroke="#5D5FEF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </>
);

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ArrowDownSmallIcon = (props): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
    {icon}
  </svg>
);

export default ArrowDownSmallIcon;
