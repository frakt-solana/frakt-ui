import { TokenInfo } from '@solana/spl-token-registry';
import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import moment from 'moment';
import { keyBy, Dictionary } from 'lodash';

import { FusionPool } from '../../../../contexts/liquidityPools';
import { useTokenListContext } from '../../../../contexts/TokenList';
import { useSplTokenBalance } from '../../../../utils/accounts';
import { useAPR } from '../../hooks';
import { useInventoryStakingTotalLiquidityUSD } from './useInventoryStakingTotalLiquidityUSD';

type UseStakingPageInfo = (props: {
  inventoryFusionPool: FusionPool;
  liquidityFusionPool: FusionPool;
  poolTokenInfo: TokenInfo;
}) => {
  loading: boolean;
  inventoryAPR: number;
  liquidityAPR: number;
  raydiumPoolLiquidityUSD: number;
  inventoryTotalLiquidity: number;
  poolTokenBalance: number;
  lpTokenBalance: number;
  poolTokensStaked: number;
  lpTokensStaked: number;
  stakeRewards: { ticker: string; balance: number }[];
};

export const useStakingPageInfo: UseStakingPageInfo = ({
  inventoryFusionPool,
  liquidityFusionPool,
  poolTokenInfo,
}) => {
  const { connected, publicKey: walletPublicKey } = useWallet();
  const { tokensList, loading: tokensListLoading } = useTokenListContext();

  const stakeRewards = useMemo(() => {
    if (
      tokensList?.length &&
      !tokensListLoading &&
      connected &&
      inventoryFusionPool &&
      liquidityFusionPool
    ) {
      const tokensMap = keyBy(tokensList, 'address');

      const liquidityRewards = getFusionRewards(
        liquidityFusionPool,
        tokensMap,
        walletPublicKey?.toBase58(),
      );
      const inventoryRewards = getFusionRewards(
        inventoryFusionPool,
        tokensMap,
        walletPublicKey?.toBase58(),
      );

      return [...liquidityRewards, ...inventoryRewards];
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    tokensList?.length,
    tokensListLoading,
    connected,
    inventoryFusionPool,
    liquidityFusionPool,
  ]);

  const { inventoryAPR, liquidityAPR, raydiumPoolLiquidityUSD } =
    useAPR(poolTokenInfo);

  const {
    totalLiquidity: inventoryTotalLiquidity,
    loading: inventoryTotalLiquidityLoading,
  } = useInventoryStakingTotalLiquidityUSD({
    inventoryFusionPool,
    poolTokenInfo,
  });

  const { balance: poolTokenBalance } = useSplTokenBalance(
    inventoryFusionPool?.router?.tokenMintInput,
    9,
  );

  const { balance: lpTokenBalance } = useSplTokenBalance(
    liquidityFusionPool?.router?.tokenMintInput,
    9,
  );

  const poolTokensStaked = getStakedBalanceFromFusion(
    inventoryFusionPool,
    walletPublicKey?.toBase58(),
  );

  const lpTokensStaked = getStakedBalanceFromFusion(
    liquidityFusionPool,
    walletPublicKey?.toBase58(),
  );

  return {
    loading: inventoryTotalLiquidityLoading,
    inventoryAPR,
    liquidityAPR,
    raydiumPoolLiquidityUSD,
    inventoryTotalLiquidity,
    poolTokenBalance,
    lpTokenBalance,
    poolTokensStaked,
    lpTokensStaked,
    stakeRewards,
  };
};

const getStakedBalanceFromFusion = (
  fusionPool: FusionPool,
  walletPublicKey: string,
): number => {
  const account =
    fusionPool?.stakeAccounts?.find(
      ({ stakeOwner, isStaked }) => stakeOwner === walletPublicKey && isStaked,
    ) || null;

  return Number(account?.amount) / 1e9 || 0;
};

const getFusionRewards = (
  fusionPool: FusionPool,
  tokensMap: Dictionary<TokenInfo>,
  walletPublicKey: string,
): { ticker: string; balance: number }[] => {
  const primaryRewards = getPrimaryRewards(
    fusionPool,
    tokensMap,
    walletPublicKey,
  );

  const secondaryRewards = getSecondaryFusionRewards(
    fusionPool,
    tokensMap,
    walletPublicKey,
  );

  return [primaryRewards, ...secondaryRewards];
};

const getPrimaryRewards = (
  fusionPool: FusionPool,
  tokensMap: Dictionary<TokenInfo>,
  walletPublicKey: string,
): { ticker: string; balance: number } => {
  const account =
    fusionPool?.stakeAccounts?.find(
      ({ stakeOwner, isStaked }) => stakeOwner === walletPublicKey && isStaked,
    ) || null;

  const checkDate = moment().unix();

  const stakedAtCumulative = Number(account?.stakedAtCumulative) || 0;
  const cumulative = Number(fusionPool?.router?.cumulative) || 0;
  const apr = Number(fusionPool?.router?.apr) || 0;
  const lastTime = Number(fusionPool?.router?.lastTime) || 0;
  const amount = Number(account?.amount) || 0;
  const decimalsInput = Number(fusionPool?.router?.decimalsInput) || 0;
  const decimalsOutput = Number(fusionPool?.router?.decimalsOutput) || 0;
  const tokenMintOutput = fusionPool?.router?.tokenMintOutput;

  const primaryRewardsAmount =
    ((cumulative + apr * (checkDate - lastTime) - stakedAtCumulative) *
      amount) /
    (1e10 / decimalsInput) /
    decimalsInput /
    decimalsOutput;

  const primaryRewards = {
    ticker: tokensMap[tokenMintOutput]?.symbol || 'unknown',
    balance: primaryRewardsAmount,
  };

  return primaryRewards;
};

const getSecondaryFusionRewards = (
  fusionPool: FusionPool,
  tokensMap: Dictionary<TokenInfo>,
  walletPublicKey: string,
): { ticker: string; balance: number }[] => {
  const primaryStakeAccount =
    fusionPool?.stakeAccounts?.find(
      ({ stakeOwner, isStaked }) => stakeOwner === walletPublicKey && isStaked,
    ) || null;

  const amount = Number(primaryStakeAccount?.amount) || 0;
  const stakeEnd = Number(primaryStakeAccount?.stakeEnd) || moment().unix();

  const decimalsInput = Number(fusionPool?.router?.decimalsInput) || 0;

  return (
    fusionPool?.secondaryRewards
      ?.map(({ rewards, stakeAccounts: secondaryStakeAccounts }) => {
        const secondaryStakeAccount =
          secondaryStakeAccounts?.find(
            ({ rewardOwner }) => rewardOwner === walletPublicKey,
          ) || null;

        if (secondaryStakeAccount) {
          const tokensPerSecondPerPoint =
            Number(rewards?.tokensPerSecondPerPoint) || 0;
          const decimalsOutput = Number(rewards?.decimalsOutput) || 0;

          const lastHarvestedAt =
            Number(secondaryStakeAccount?.lastHarvestedAt) || 0;

          const secondaryRewardsAmount =
            ((stakeEnd - lastHarvestedAt) *
              (tokensPerSecondPerPoint * amount)) /
            decimalsInput /
            decimalsOutput;

          return {
            ticker: tokensMap[rewards?.tokenMint]?.symbol || 'unknown',
            balance: secondaryRewardsAmount,
          };
        }

        return null;
      })
      ?.filter((token) => !!token) || []
  );
};
