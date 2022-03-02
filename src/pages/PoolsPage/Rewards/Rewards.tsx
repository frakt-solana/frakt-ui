import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { SecondaryRewardView } from '@frakters/frkt-multiple-reward/lib/accounts';

import Button from '../../../components/Button';
import styles from './styles.module.scss';
import {
  caclLiquiditySecondRewars,
  calcLiquidityRewards,
  FusionPoolInfo,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';
import { useTokenListContext } from '../../../contexts/TokenList';

interface RewardsInterface {
  baseToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  fusionPoolInfo: FusionPoolInfo;
}

interface secondaryRewardWithTokenInfo extends SecondaryRewardView {
  tokenInfo: TokenInfo[];
}

const Rewards: FC<RewardsInterface> = ({ fusionPoolInfo }) => {
  const { harvestLiquidity } = useLiquidityPools();
  const { mainRouter, stakeAccount, secondaryReward, secondaryStakeAccount } =
    fusionPoolInfo;

  const { tokensList } = useTokenListContext();

  const onSubmitHandler = async () => {
    await harvestLiquidity({
      router: mainRouter,
      stakeAccount,
      secondaryReward,
    });
  };

  const secondaryRewardInfoByMint = secondaryReward.reduce((acc, reward) => {
    const tokenListSymbol = tokensList.filter(
      ({ address }) => address === reward.tokenMint,
    );
    acc.push({ ...reward, tokenInfo: tokenListSymbol });

    return acc;
  }, [] as secondaryRewardWithTokenInfo[]);

  const rewardInfoByMint = tokensList.filter(
    ({ address }) => address === stakeAccount.tokenMintOutput,
  );

  return (
    <div className={styles.rewards}>
      <p className={styles.title}>Pending rewards</p>
      <div className={styles.content}>
        <div className={styles.info}>
          <p>
            {calcLiquidityRewards(mainRouter, stakeAccount)}{' '}
            <span>{rewardInfoByMint[0]?.symbol}</span>
          </p>
          <div className={styles.rewardInfo}>
            {secondaryRewardInfoByMint.map((reward) => (
              <span key={reward.tokenMint}>
                <span>
                  {caclLiquiditySecondRewars(
                    stakeAccount,
                    reward,
                    secondaryStakeAccount,
                    mainRouter,
                  )}
                </span>{' '}
                <span>{reward.tokenInfo[0].symbol} </span>
              </span>
            ))}
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
