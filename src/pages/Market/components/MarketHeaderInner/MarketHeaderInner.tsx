import classNames from 'classnames/bind';
import { FC, ReactNode } from 'react';

import { useHeaderState } from '../../../../components/Layout/headerState';
import { MarketNavigation } from '../MarketNavigation';
import styles from './MarketHeaderInner.module.scss';

interface MarketHeaderInnerProps {
  children?: ReactNode;
  poolPublicKey: string;
  className?: string;
}

export const MarketHeaderInner: FC<MarketHeaderInnerProps> = ({
  children,
  poolPublicKey,
  className,
}) => {
  const { isHeaderHidden } = useHeaderState();

  return (
    <div
      className={classNames({
        [styles.positionWrapper]: true,
        [styles.headerHidden]: isHeaderHidden,
      })}
    >
      <div className={classNames('container', styles.container, className)}>
        <div className={styles.wrapper}>
          {children}
          <MarketNavigation poolPublicKey={poolPublicKey} />
        </div>
      </div>
    </div>
  );
};
