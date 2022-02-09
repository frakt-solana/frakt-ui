import { FC } from 'react';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import Button from '../../../components/Button';
import { SOL_TOKEN } from '../../../utils';
import styles from './styles.module.scss';
import {
  ProgramAccountData,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';

interface RewardsInterface {
  baseToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  programAccount: ProgramAccountData;
}

const Rewards: FC<RewardsInterface> = ({ baseToken, programAccount }) => {
  const { harvestLiquidity } = useLiquidityPools();

  const onSubmitHandler = () => {
    if (programAccount) {
      const { mainRouter, stakeAccount } = programAccount;

      harvestLiquidity({ router: mainRouter, stakeAccount });
    }
  };

  return (
    <div className={styles.rewards}>
      <p className={styles.title}>Pending rewards</p>
      <div className={styles.content}>
        <div className={styles.info}>
          <p>
            0.0 <span>{SOL_TOKEN.symbol}</span>
          </p>
          <p>
            0.0 <span>{baseToken.symbol}</span>
          </p>
        </div>
        <Button
          type="tertiary"
          className={styles.harvestBtn}
          onClick={onSubmitHandler}
        >
          Harvest
        </Button>
      </div>
    </div>
  );
};

export default Rewards;
