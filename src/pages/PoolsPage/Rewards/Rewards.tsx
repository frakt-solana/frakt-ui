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
import { AccountInfoParsed } from '../../../utils/accounts';

interface RewardsInterface {
  baseToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  fusionPoolInfo: FusionPoolInfo;
  lpTokenAccountInfo: AccountInfoParsed;
}

interface secondaryRewardWithTokenInfo extends SecondaryRewardView {
  tokenInfo: TokenInfo[];
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
  const { lpDecimals } = raydiumPoolInfo;

  const balance =
    lpTokenAccountInfo?.accountInfo?.amount.toNumber() / 10 ** lpDecimals || 0;

  const onSubmitHandler = async () => {
    await harvestLiquidity({
      router: mainRouter,
      stakeAccount,
      secondaryReward,
    });
  };

  const onStakeHandler = async (): Promise<void> => {
    if (fusionPoolInfo) {
      const { mainRouter } = fusionPoolInfo;

      await stakeLiquidity({
        amount: lpTokenAccountInfo?.accountInfo?.amount,
        router: mainRouter,
      });
    }
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
        <div className={styles.wrapperBtn}>
          {!!balance && (
            <Button
              className={styles.stakeBtn}
              type="tertiary"
              onClick={onStakeHandler}
            >
              stake
            </Button>
          )}
          <Button
            type="tertiary"
            className={styles.harvestBtn}
            onClick={onSubmitHandler}
          >
            Harvest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
