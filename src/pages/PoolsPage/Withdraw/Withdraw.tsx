import { FC, useEffect, useRef, useState } from 'react';
import BN from 'bn.js';
import {
  LiquidityPoolKeysV4,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import { TokenFieldWithBalance } from '../../../components/TokenField';
import {
  AccountInfoParsed,
  getTokenAccountBalance,
} from '../../../utils/accounts';
import Button from '../../../components/Button';
import { SOL_TOKEN } from '../../../utils';
import styles from './Withdraw.module.scss';
import {
  FusionPoolInfo,
  getStakedBalance,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';
import {
  LoadingModal,
  useLoadingModal,
} from '../../../components/LoadingModal';

interface WithdrawInterface {
  baseToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  fusionPoolInfo: FusionPoolInfo;
  lpTokenAccountInfo: AccountInfoParsed;
}

const Withdraw: FC<WithdrawInterface> = ({
  baseToken,
  poolConfig,
  raydiumPoolInfo,
  fusionPoolInfo,
  lpTokenAccountInfo,
}) => {
  const {
    removeRaydiumLiquidity: removeRaydiumLiquidityTxn,
    unstakeLiquidity,
  } = useLiquidityPools();
  const [withdrawValue, setWithdrawValue] = useState<string>('');
  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);

  const { lpMint } = poolConfig;
  const { lpDecimals } = raydiumPoolInfo;

  const balance = getTokenAccountBalance(lpTokenAccountInfo, lpDecimals);

  const stakedBalance = getStakedBalance(fusionPoolInfo, lpDecimals);
  const lpTokenAmountOnSubmit = useRef<BN>();
  const removeLiquidityWithUnstake = useRef<boolean>();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const isStakedInFusion = fusionPoolInfo?.stakeAccount?.isStaked;

  const removeRaydiumLiquidity = async () => {
    try {
      setTransactionsLeft(1);
      const lpTokenAmount = new TokenAmount(
        new Token(lpMint, lpDecimals),
        lpTokenAmountOnSubmit.current,
      );

      await removeRaydiumLiquidityTxn({
        baseToken,
        quoteToken: SOL_TOKEN,
        amount: lpTokenAmount,
        poolConfig,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      lpTokenAmountOnSubmit.current = null;
      removeLiquidityWithUnstake.current = null;
      closeLoadingModal();
      setTransactionsLeft(null);
    }
  };

  const onSubmitHandler = async (): Promise<void> => {
    try {
      if (isStakedInFusion) {
        setTransactionsLeft(2);
      }
      openLoadingModal();

      const lpTokenAmountBN = new BN(Number(withdrawValue) * 10 ** lpDecimals);
      lpTokenAmountOnSubmit.current = lpTokenAmountBN;

      if (isStakedInFusion) {
        removeLiquidityWithUnstake.current = true;
        const { mainRouter, secondaryReward, stakeAccount } = fusionPoolInfo;
        const result = await unstakeLiquidity({
          router: mainRouter,
          secondaryReward,
          amount: lpTokenAmountBN,
          stakeAccount,
        });
        if (!result) throw new Error('Unstake failed');
        setTransactionsLeft(1);
      } else {
        removeRaydiumLiquidity();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      lpTokenAmountOnSubmit.current = null;
      removeLiquidityWithUnstake.current = null;
      closeLoadingModal();
      setTransactionsLeft(null);
    }
  };

  useEffect(() => {
    if (removeLiquidityWithUnstake.current) {
      removeRaydiumLiquidity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lpTokenAccountInfo]);

  return (
    <div className={styles.withdraw}>
      <div className={styles.header}>
        <p className={styles.title}>Withdraw</p>
        <div className={styles.balanceWrap}>
          {stakedBalance && fusionPoolInfo.stakeAccount ? (
            <p className={styles.balance}>Staked balance: {stakedBalance}</p>
          ) : (
            <p className={styles.balance}>Wallet balance: {balance}</p>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <TokenFieldWithBalance
          className={styles.input}
          value={withdrawValue}
          onValueChange={(nextValue) => setWithdrawValue(nextValue)}
          style={{ width: '100%' }}
          showMaxButton
          lpTokenSymbol={baseToken.symbol}
          lpBalance={
            stakedBalance && isStakedInFusion ? stakedBalance : balance
          }
        />
        <Button
          type="tertiary"
          className={styles.rewardBtn}
          onClick={onSubmitHandler}
          disabled={!parseFloat(withdrawValue)}
        >
          Confirm
        </Button>
      </div>
      <LoadingModal
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle={`Time gap between transactions can be up to 1 minute.\nTransactions left: ${transactionsLeft}`}
      />
    </div>
  );
};

export default Withdraw;
