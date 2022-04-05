import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';

import Button from '../../../components/Button';
import styles from './Rewards.module.scss';
import {
  caclFusionSecondRewards,
  calcFusionMainRewards,
  FusionPoolInfo,
  getTokenInfoByReward,
  getTokenInfoBySecondaryReward,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';
import { useTokenListContext } from '../../../contexts/TokenList';
import {
  AccountInfoParsed,
  getTokenAccountBalance,
} from '../../../utils/accounts';

interface RewardsInterface {
  baseToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  fusionPoolInfo: FusionPoolInfo;
  lpTokenAccountInfo: AccountInfoParsed;
}

const Rewards: FC<RewardsInterface> = ({
  fusionPoolInfo,
  lpTokenAccountInfo,
  raydiumPoolInfo,
}) => {
  const { harvestLiquidity, stakeLiquidity } = useLiquidityPools();
  const { tokensList } = useTokenListContext();

  const { mainRouter, stakeAccount, secondaryReward, secondaryStakeAccount } =
    fusionPoolInfo;

  const balance = getTokenAccountBalance(
    lpTokenAccountInfo,
    raydiumPoolInfo.lpDecimals,
  );

  const onHarvestLiquidity = async (): Promise<void> => {
    await harvestLiquidity({
      router: mainRouter,
      stakeAccount,
      secondaryReward,
    });
  };

  const onStakeLiquidity = async (): Promise<void> => {
    await stakeLiquidity({
      amount: lpTokenAccountInfo?.accountInfo.amount,
      router: mainRouter,
    });
  };

  const rewardInfoByMint = getTokenInfoByReward(stakeAccount, tokensList);
  const secondaryRewardInfoByMint = getTokenInfoBySecondaryReward(
    secondaryReward,
    tokensList,
  );

  return (
    <div className={styles.rewards}>
      <div className={styles.content}>
        <div className={styles.info}>
          <p className={styles.title}>Pending rewards</p>
          {stakeAccount ? (
            <div className={styles.rewardInfo}>
              <p>
                {calcFusionMainRewards(mainRouter, stakeAccount)?.toFixed(5)}{' '}
                <span>{rewardInfoByMint[0]?.symbol}</span>
              </p>
              {secondaryRewardInfoByMint.map((reward) => (
                <span key={reward.tokenMint}>
                  <span>
                    {caclFusionSecondRewards(
                      stakeAccount,
                      reward,
                      secondaryStakeAccount,
                      mainRouter,
                    )?.toFixed(5)}
                  </span>{' '}
                  <span>{reward.tokenInfo[0].symbol}</span>
                </span>
              ))}
            </div>
          ) : (
            <div className={styles.rewardInfo}>
              <p>You are not staking LP tokens yet</p>
            </div>
          )}
        </div>
        <div className={styles.wrapperBtn}>
          {!!balance && (
            <Button
              className={styles.stakeBtn}
              type="tertiary"
              onClick={onStakeLiquidity}
            >
              Stake
            </Button>
          )}
          {calcFusionMainRewards(
            fusionPoolInfo.mainRouter,
            fusionPoolInfo.stakeAccount,
          ) > 1e-5 && (
            <Button
              type="tertiary"
              className={styles.harvestBtn}
              onClick={onHarvestLiquidity}
            >
              Harvest
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
