import { raydium, TokenInfo, BN } from '@frakt-protocol/frakt-sdk';

import { useLoadingModal } from '../../../../../components/LoadingModal';
import {
  FusionPool,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../../../../utils';

type UseStakeAndWithdrawLPProps = (props: {
  liquidityFusionPool: FusionPool;
  poolToken: TokenInfo;
  lpTokenBalance?: number;
  raydiumLiquidityPoolKeys: raydium.LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
}) => {
  visible: boolean;
  close: () => void;
  stakeLp: () => Promise<void>;
  withdrawLp: () => Promise<void>;
};

export const useStakeAndWithdrawLP: UseStakeAndWithdrawLPProps = ({
  liquidityFusionPool,
  poolToken,
  lpTokenBalance = 0,
  raydiumLiquidityPoolKeys,
  raydiumPoolInfo,
}) => {
  const {
    removeRaydiumLiquidity: removeRaydiumLiquidityTxn,
    stakeLiquidity: stakeLiquidityTxn,
  } = useLiquidityPools();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const stakeLiquidity = async (): Promise<void> => {
    try {
      openLoadingModal();

      const amount = new BN(lpTokenBalance * 10 ** raydiumPoolInfo?.lpDecimals);

      const result = await stakeLiquidityTxn({
        amount,
        router: liquidityFusionPool?.router,
      });

      if (!result) {
        throw new Error('Stake LP token failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  const removeRaydiumLiquidity = async (): Promise<void> => {
    try {
      openLoadingModal();

      const amount = new BN(lpTokenBalance * 10 ** raydiumPoolInfo?.lpDecimals);

      const lpTokenAmount = new raydium.TokenAmount(
        new raydium.Token(
          raydiumLiquidityPoolKeys?.lpMint,
          raydiumPoolInfo?.lpDecimals,
        ),
        amount,
      );

      const result = await removeRaydiumLiquidityTxn({
        baseToken: poolToken,
        quoteToken: SOL_TOKEN,
        amount: lpTokenAmount,
        poolConfig: raydiumLiquidityPoolKeys,
      });

      if (!result) {
        throw new Error('Withdraw LP token failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    stakeLp: stakeLiquidity,
    withdrawLp: removeRaydiumLiquidity,
  };
};
