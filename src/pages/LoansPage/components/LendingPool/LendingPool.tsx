import { FC, useState } from 'react';
import classNames from 'classnames';

import Button from '../../../../components/Button';
import styles from './LendingPool.module.scss';
import { SOL_TOKEN } from '../../../../utils';
import { PoolModal } from '../../../../components/PoolModal';

interface LendingPoolProps {
  apy?: string;
  loans?: string;
  deposit?: string;
  totalSupply?: string;
  name?: string;
}

const LendingPool: FC<LendingPoolProps> = ({
  deposit,
  apy,
  totalSupply,
  loans,
}) => {
  const [poolModalVisible, setPoolModalVisible] = useState<boolean>(false);

  return (
    <>
      <div className={styles.pool}>
        <div className={styles.header}>
          <div className={styles.rewards}>
            <p className={styles.reward}>15000 SOL</p>
          </div>
          <Button
            className={classNames(styles.btn, styles.btnHarvest)}
            type="tertiary"
          >
            Harvest
          </Button>
        </div>
        <div className={styles.poolCard}>
          <div className={styles.tokenInfo}>
            <div>
              <img src={SOL_TOKEN.logoURI} className={styles.image} />
              <img src={SOL_TOKEN.logoURI} className={styles.image} />
            </div>
            <div className={styles.subtitle}>Aggregated Lending Pool</div>
          </div>

          <div className={styles.statsValue}>
            <div className={styles.totalValue}>
              <p className={styles.title}>Total supply</p>
              <div>
                <p className={styles.value}>{totalSupply} SOL</p>
                <p className={styles.equivalent}>≈ $10.000</p>
              </div>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>APY</p>
              <p className={styles.value}>{apy || 0} %</p>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Your deposit</p>
              <div>
                <p className={styles.value}>{deposit || 0} SOL</p>
                <p className={styles.equivalent}>≈ $10.000</p>
              </div>
            </div>
            <div className={styles.totalValue}>
              <p className={styles.title}>Your loans</p>
              <div>
                <p className={styles.value}>{loans || 0} SOL</p>
              </div>
            </div>
            <div className={styles.btnWrapper}>
              <Button
                className={styles.btn}
                type="tertiary"
                onClick={() => setPoolModalVisible(true)}
              >
                Withdraw
              </Button>
              <Button
                className={styles.btn}
                type="alternative"
                onClick={() => setPoolModalVisible(true)}
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PoolModal
        visible={poolModalVisible}
        onCancel={() => setPoolModalVisible(false)}
      />
    </>
  );
};

export default LendingPool;
