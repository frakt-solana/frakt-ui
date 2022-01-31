import { FC } from 'react';

import { TokenInfo } from '@solana/spl-token-registry';
import Button from '../../../components/Button';
import { SOL_TOKEN } from '../../../utils';
import styles from './styles.module.scss';

interface RewardsInterface {
  quoteToken: TokenInfo;
}

const Rewards: FC<RewardsInterface> = ({ quoteToken }) => {
  return (
    <div className={styles.rewards}>
      <p className={styles.title}>Pending rewards</p>
      <div className={styles.content}>
        <div className={styles.info}>
          <p>
            0.0 <span>{SOL_TOKEN.symbol}</span>
          </p>
          <p>
            0.0 <span>{quoteToken.symbol}</span>
          </p>
        </div>
        <Button type="tertiary" className={styles.harvestBtn}>
          Harvest
        </Button>
      </div>
    </div>
  );
};

export default Rewards;
