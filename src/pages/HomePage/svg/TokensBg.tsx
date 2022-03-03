import React from 'react';

export const TokensBg = ({
  className,
  width,
  fill = '#83D6A4',
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '654'}
    viewBox="0 0 654 120"
    fill="none"
  >
    <rect y="90" width="20" height="20" fill={fill} />
    <rect x="51" y="100" width="20" height="20" fill={fill} />
    <rect x="71" y="100" width="20" height="20" fill={fill} />
    <rect x="61" y="59" width="20" height="20" fill={fill} fillOpacity="0.3" />
    <rect x="111" y="80" width="20" height="20" fill={fill} />
    <rect x="154" y="68" width="20" height="20" fill={fill} fillOpacity="0.3" />
    <rect x="174" y="68" width="20" height="20" fill={fill} fillOpacity="0.3" />
    <rect x="164" y="100" width="20" height="20" fill={fill} />
    <rect x="215" y="100" width="20" height="20" fill={fill} />
    <rect x="225" y="56" width="20" height="20" fill={fill} />
    <rect x="245" y="56" width="20" height="20" fill={fill} />
    <rect x="265" y="56" width="20" height="20" fill={fill} />
    <rect x="265" y="100" width="20" height="20" fill={fill} />
    <rect x="300" y="83" width="20" height="20" fill={fill} />
    <rect x="335" y="59" width="20" height="20" fill={fill} fillOpacity="0.3" />
    <rect x="335" y="100" width="20" height="20" fill={fill} />
    <rect x="385" y="100" width="20" height="20" fill={fill} />
    <rect x="405" y="100" width="20" height="20" fill={fill} />
    <rect x="452" y="100" width="20" height="20" fill={fill} />
    <rect x="452" y="39" width="20" height="20" fill={fill} />
    <rect x="492" width="20" height="20" fill={fill} fillOpacity="0.3" />
    <rect x="512" y="100" width="20" height="20" fill={fill} />
    <rect x="538" y="100" width="20" height="20" fill={fill} />
    <rect x="523" y="53" width="20" height="20" fill={fill} />
    <rect x="584" y="34" width="20" height="20" fill={fill} fillOpacity="0.3" />
    <rect x="584" y="100" width="20" height="20" fill={fill} />
    <rect x="634" y="100" width="20" height="20" fill={fill} />
  </svg>
);
