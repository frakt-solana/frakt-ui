const icon = (
  <path d="M3.52876 6.19526C3.78911 5.93491 4.21122 5.93491 4.47157 6.19526L8.00016 9.72386L11.5288 6.19526C11.7891 5.93491 12.2112 5.93491 12.4716 6.19526C12.7319 6.45561 12.7319 6.87772 12.4716 7.13807L8.47157 11.1381C8.21122 11.3984 7.78911 11.3984 7.52876 11.1381L3.52876 7.13807C3.26841 6.87772 3.26841 6.45561 3.52876 6.19526Z" />
);

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const ChevronDownIcon = ({
  className,
  fill,
  stroke,
}: any): JSX.Element => (
  <svg
    className={className || ''}
    fill={fill}
    stroke={stroke || 'none'}
    viewBox="0 0 16 16"
  >
    {icon}
  </svg>
);

export default ChevronDownIcon;
