import classNames from 'classnames/bind';
import { FC, ReactNode } from 'react';

import { useHeaderState } from '../../../../components/Layout/headerState';
import { NFTPoolsNavigation } from '../NFTPoolsNavigation';
import styles from './NFTPoolsHeaderInner.module.scss';

interface MarketHeaderInnerProps {
  children?: ReactNode;
  poolPublicKey: string;
  className?: string;
}

export const NFTPoolsHeaderInner: FC<MarketHeaderInnerProps> = ({
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
          <NFTPoolsNavigation poolPublicKey={poolPublicKey} />
        </div>
      </div>
    </div>
  );
};
