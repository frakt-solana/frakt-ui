import { QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import { FC, ReactNode } from 'react';
import { Container } from '../../../../components/Layout';
import Tooltip from '../../../../components/Tooltip';

import { NFTPoolsNavigation } from '../NFTPoolsNavigation';
import styles from './NFTPoolsHeaderInner.module.scss';

interface MarketHeaderInnerProps {
  children?: ReactNode;
  poolPublicKey: string;
  className?: string;
  wrapperClassName?: string;
  hidden?: boolean;
}

export const NFTPoolsHeaderInner: FC<MarketHeaderInnerProps> = ({
  children,
  poolPublicKey,
  className,
  wrapperClassName,
  hidden,
}) => {
  return (
    <Container
      className={classNames(styles.container, wrapperClassName, {
        [styles.hidden]: hidden,
      })}
    >
      <div className={classNames(styles.header, className)}>
        {children}
        <NFTPoolsNavigation
          poolPublicKey={poolPublicKey}
          className={styles.poolsNavigation}
        />
        <div className={styles.aprContainer}>
          <p className={styles.aprContainerTitle}>
            APRs{' '}
            <Tooltip
              placement="bottom"
              trigger="hover"
              overlay="APR is calculated based on the previous 30 days of activity annualized."
            >
              <QuestionCircleOutlined className={styles.aprContainerQuestion} />
            </Tooltip>
          </p>
          <p className={styles.aprValues}>
            <span className={styles.aprValueRed}>111.00 %</span> /{' '}
            <span className={styles.aprValueGreen}>124.99 %</span>
          </p>
        </div>
      </div>
    </Container>
  );
};
