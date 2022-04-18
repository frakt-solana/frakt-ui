import { QuestionCircleOutlined } from '@ant-design/icons';
import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames/bind';
import { FC, ReactNode } from 'react';

import { Container } from '../../../../components/Layout';
import Tooltip from '../../../../components/Tooltip';
import { NftPoolData } from '../../../../utils/cacher/nftPools';
import { useAPR } from '../../hooks';
import { NFTPoolsNavigation } from '../NFTPoolsNavigation';
import styles from './NFTPoolsHeaderInner.module.scss';

interface MarketHeaderInnerProps {
  children?: ReactNode;
  pool: NftPoolData;
  poolTokenInfo?: TokenInfo;
  className?: string;
  wrapperClassName?: string;
  hidden?: boolean;
}

export const NFTPoolsHeaderInner: FC<MarketHeaderInnerProps> = ({
  children,
  pool,
  className,
  wrapperClassName,
  poolTokenInfo,
  hidden,
}) => {
  const { loading: aprLoading, liquidityAPR } = useAPR(poolTokenInfo);

  return (
    <Container
      className={classNames(styles.container, wrapperClassName, {
        [styles.hidden]: hidden,
      })}
    >
      <div className={classNames(styles.header, className)}>
        {children}
        <NFTPoolsNavigation pool={pool} className={styles.poolsNavigation} />
        {!aprLoading && (
          <div className={styles.aprContainer}>
            <p className={styles.aprContainerTitle}>
              Staking APR{' '}
              <Tooltip
                placement="bottom"
                trigger="hover"
                overlay="APR is calculated based on the previous 30 days of activity annualized."
              >
                <QuestionCircleOutlined
                  className={styles.aprContainerQuestion}
                />
              </Tooltip>
            </p>
            <p className={styles.aprValues}>
              <span className={styles.aprValueGreen}>
                {liquidityAPR.toFixed(2) || 0} %
              </span>{' '}
              {/* / <span className={styles.aprValueGreen}>124.99 %</span> */}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};
