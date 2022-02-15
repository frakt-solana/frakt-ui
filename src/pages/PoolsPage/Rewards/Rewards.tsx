import { FC } from 'react';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import Button from '../../../components/Button';
import { SOL_TOKEN } from '../../../utils';
import styles from './styles.module.scss';
import {
  caclLiquiditySecondRewars,
  calcLiquidityRewards,
  FusionPoolInfo,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';

interface RewardsInterface {
  baseToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  fusionPoolInfo: FusionPoolInfo;
}

const Rewards: FC<RewardsInterface> = ({ baseToken, fusionPoolInfo }) => {
  const { harvestLiquidity, harvestSecondaryLiquidity } = useLiquidityPools();
  const { mainRouter, stakeAccount, secondaryReward, secondaryStakeAccount } =
    fusionPoolInfo;

  const onSubmitHandler = async () => {
    await harvestLiquidity({ router: mainRouter, stakeAccount });
    await harvestSecondaryLiquidity({
      router: mainRouter,
      stakeAccount,
      secondaryReward,
    });
  };

  return (
    <div className={styles.rewards}>
      <p className={styles.title}>Pending rewards</p>
      <div className={styles.content}>
        <div className={styles.info}>
          <p>
            {calcLiquidityRewards(mainRouter, stakeAccount)}{' '}
            <span>{SOL_TOKEN.symbol}</span>
          </p>
          <div>
            <div className={styles.rewardInfo}>
              {secondaryReward.map((secondaryReward) => (
                <span key={secondaryReward.tokenMint}>
                  <span>
                    {caclLiquiditySecondRewars(
                      stakeAccount,
                      secondaryReward,
                      secondaryStakeAccount,
                      mainRouter,
                    )}
                  </span>{' '}
                  <span>{baseToken.symbol}</span>
                </span>
              ))}
            </div>
          </div>
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
