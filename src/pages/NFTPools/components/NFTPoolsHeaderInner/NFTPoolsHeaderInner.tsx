import classNames from 'classnames/bind';
import { FC, ReactNode } from 'react';
import { Container } from '../../../../components/Layout';

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
  return (
    <Container className={classNames(styles.container, className)}>
      <div className={styles.header}>
        {children}
        <NFTPoolsNavigation poolPublicKey={poolPublicKey} />
      </div>
    </Container>
  );
};
