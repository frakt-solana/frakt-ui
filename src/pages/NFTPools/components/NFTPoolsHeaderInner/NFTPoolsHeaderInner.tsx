import classNames from 'classnames/bind';
import { FC, ReactNode } from 'react';
import { Container } from '../../../../components/Layout';

import { NFTPoolsNavigation } from '../NFTPoolsNavigation';
import styles from './NFTPoolsHeaderInner.module.scss';

interface MarketHeaderInnerProps {
  children?: ReactNode;
  poolPublicKey: string;
  className?: string;
  wrapperClassName?: string;
}

export const NFTPoolsHeaderInner: FC<MarketHeaderInnerProps> = ({
  children,
  poolPublicKey,
  className,
  wrapperClassName,
}) => {
  return (
    <Container className={classNames(styles.container, wrapperClassName)}>
      <div className={classNames(styles.header, className)}>
        {children}
        <NFTPoolsNavigation
          poolPublicKey={poolPublicKey}
          className={styles.poolsNavigation}
        />
      </div>
    </Container>
  );
};
