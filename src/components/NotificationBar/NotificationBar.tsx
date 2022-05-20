import { FC } from 'react';
import classNames from 'classnames';
import { CloseIcon } from '../../icons';

import styles from './styles.module.scss';

interface NotificationBarProps {
  mode: 'warning' | 'error';
  children: JSX.Element;
  className: string;
  handleClose: () => void;
}

export const NotificationBar: FC<NotificationBarProps> = ({
  mode,
  children,
  className,
  handleClose,
}) => {
  return (
    <div className={classNames(className, { [styles[mode]]: mode })}>
      {children}
      <div className={styles.close} onClick={handleClose}>
        <CloseIcon width="12px" height="12px" className={styles.icon} />
      </div>
    </div>
  );
};
