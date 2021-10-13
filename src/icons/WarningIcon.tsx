import React, { Fragment } from 'react';

import IconSvg from './IconSvg';

const icon = (
  <Fragment>
    <path
      d="M10.9999 12C10.4476 12 9.99993 11.5523 9.99993 11V8C9.99993 7.44772 10.4476 7 10.9999 7C11.5522 7 11.9999 7.44772 11.9999 8V11C11.9999 11.5523 11.5522 12 10.9999 12Z"
      fill="#F83E3E"
    />
    <path
      d="M9.49993 14.5C9.49993 13.6716 10.1715 13 10.9999 13C11.8284 13 12.4999 13.6716 12.4999 14.5C12.4999 15.3284 11.8284 16 10.9999 16C10.1715 16 9.49993 15.3284 9.49993 14.5Z"
      fill="#F83E3E"
    />
    <path
      d="M9.23009 1.2156C9.97992 -0.20907 12.0199 -0.209079 12.7698 1.2156L21.1134 17.0685C21.8144 18.4003 20.8486 20 19.3436 20H2.65629C1.15127 20 0.185495 18.4003 0.886453 17.0685L9.23009 1.2156ZM19.3436 18L10.9999 2.1471L2.65629 18L19.3436 18Z"
      fill="#F83E3E"
    />
  </Fragment>
);

//TODO: Describe type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const WarningIcon = (props: any): JSX.Element => (
  <IconSvg icon={icon} width={24} viewBox="0 0 24 24" {...props} />
);

export default WarningIcon;
