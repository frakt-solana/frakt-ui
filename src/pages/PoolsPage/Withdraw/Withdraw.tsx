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
  const { removeRaydiumLiquidity, unstakeLiquidity } = useLiquidityPools();
  const [withdrawValue, setWithdrawValue] = useState<string>('');

  const { lpMint } = poolConfig;
  const { lpDecimals } = raydiumPoolInfo;

  const balance = getTokenAccountBalance(lpTokenAccountInfo, lpDecimals);
  const stakedBalance = getStakedBalance(fusionPoolInfo, lpDecimals);
  const lpTokenAmountOnSubmit = useRef<string>(null);

  const [withdrawAmount, setWithdrawAmount] = useState<TokenAmount>();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const onSubmitHandler = async (): Promise<void> => {
    if (fusionPoolInfo) {
      const { mainRouter, secondaryReward, stakeAccount } = fusionPoolInfo;

      const baseAmount = new BN(Number(withdrawValue) * 10 ** lpDecimals);
      const amount = new TokenAmount(new Token(lpMint, lpDecimals), baseAmount);

      setWithdrawAmount(amount);
      openLoadingModal();

      lpTokenAmountOnSubmit.current =
        lpTokenAccountInfo?.accountInfo?.amount?.toString() || '0';

      if (stakedBalance) {
        await unstakeLiquidity({
          router: mainRouter,
          secondaryReward,
          amount: baseAmount,
          stakeAccount,
        });
      } else {
        await removeRaydiumLiquidity({
          baseToken,
          quoteToken: SOL_TOKEN,
          amount,
          poolConfig,
        });
        closeLoadingModal();
      }

      setWithdrawValue('');
    }
  };

  useEffect(() => {
    (async () => {
      if (stakedBalance) {
        const tokenAmount = lpTokenAccountInfo?.accountInfo?.amount?.toString();

        if (
          !!lpTokenAmountOnSubmit.current &&
          tokenAmount !== lpTokenAmountOnSubmit.current
        ) {
          await removeRaydiumLiquidity({
            baseToken,
            quoteToken: SOL_TOKEN,
            amount: withdrawAmount,
            poolConfig,
          });
          lpTokenAmountOnSubmit.current = null;
          closeLoadingModal();
        }
      }
    })();
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
          lpBalance={stakedBalance ? stakedBalance : balance}
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
      />
    </div>
  );
};

export default Withdraw;
