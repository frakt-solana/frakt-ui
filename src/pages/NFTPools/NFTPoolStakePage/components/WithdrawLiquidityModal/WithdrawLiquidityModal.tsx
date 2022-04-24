import { FC, useState } from 'react';
import {
  LiquidityPoolKeysV4,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import classNames from 'classnames';

import {
  LoadingModal,
  useLoadingModal,
} from '../../../../../components/LoadingModal';
import { TokenAmountInputWithBalance } from '../../../../../components/TokenAmountInputWithBalance';
import {
  FusionPool,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../../../contexts/liquidityPools';
import { CloseModalIcon } from '../../../../../icons';
import { SOL_TOKEN } from '../../../../../utils';
import { useSplTokenBalance } from '../../../../../utils/accounts';
import { ModalHeader, SubmitButton } from '../../../components/ModalParts';
import styles from './WithdrawLiquidityModal.module.scss';
import { Slider } from '../../../../../components/Slider';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';

export interface WithdrawLiquidityModalProps {
  visible?: boolean;
  setVisible?: (nextValue: boolean) => void;
  baseToken: TokenInfo;
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  liquidityFusionPool: FusionPool;
  lpTokenStakedAmount?: number;
  withdrawStaked?: boolean;
}

export const WithdrawLiquidityModal: FC<WithdrawLiquidityModalProps> = ({
  visible = false,
  setVisible = () => {},
  baseToken,
  raydiumLiquidityPoolKeys,
  raydiumPoolInfo,
  lpTokenStakedAmount,
  withdrawStaked = false,
  liquidityFusionPool,
}) => {
  const {
    removeRaydiumLiquidity: removeRaydiumLiquidityTxn,
    unstakeLiquidity,
  } = useLiquidityPools();

  const { publicKey: walletPublicKey } = useWallet();

  const [percent, setPercent] = useState(0);
  const [lpValue, setLpValue] = useState<string>('');
  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);

  const { balance: lpTokenWalletBalance } = useSplTokenBalance(
    raydiumLiquidityPoolKeys?.lpMint?.toBase58(),
    raydiumPoolInfo?.lpDecimals,
  );

  const lpTokenBalance = withdrawStaked
    ? lpTokenStakedAmount
    : lpTokenWalletBalance;

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const notEnoughLpTokenError = parseFloat(lpValue) > lpTokenBalance;

  const lpTokenSymbol = `${baseToken?.symbol}/${SOL_TOKEN?.symbol}`;

  const onLpValueChange = (nextValue: string) => {
    setLpValue(nextValue);

    const percentOfBalance = (parseFloat(nextValue) / lpTokenBalance) * 100;

    if (percentOfBalance >= 0 && percentOfBalance <= 100) {
      setPercent(percentOfBalance);
    } else if (percentOfBalance > 100) {
      setPercent(100);
    } else {
      setPercent(0);
    }
  };

  const onPercentChange = (nextValue: number) => {
    const lpStringValue = (lpTokenBalance * nextValue) / 100;

    setLpValue(lpStringValue ? lpStringValue?.toFixed(3) : '0');

    setPercent(nextValue);
  };

  const submitButtonDisabled = notEnoughLpTokenError || !percent;

  const removeRaydiumLiquidity = async (removeAmount: BN): Promise<boolean> => {
    const lpTokenAmount = new TokenAmount(
      new Token(raydiumLiquidityPoolKeys?.lpMint, raydiumPoolInfo?.lpDecimals),
      removeAmount,
    );

    const result = await removeRaydiumLiquidityTxn({
      baseToken,
      quoteToken: SOL_TOKEN,
      amount: lpTokenAmount,
      poolConfig: raydiumLiquidityPoolKeys,
    });

    return !!result;
  };

  const onSubmit = async (): Promise<void> => {
    try {
      if (withdrawStaked) {
        setTransactionsLeft(2);
      } else {
        setTransactionsLeft(1);
      }

      setVisible(false);

      openLoadingModal();

      const removeAmount = new BN(
        parseFloat(lpValue) * 10 ** raydiumPoolInfo?.lpDecimals,
      );

      if (withdrawStaked) {
        const { router, secondaryRewards, stakeAccounts } = liquidityFusionPool;
        const walletStakeAccount = stakeAccounts?.find(
          ({ stakeOwner }) => stakeOwner === walletPublicKey?.toBase58(),
        );

        const unstakeResult = await unstakeLiquidity({
          router,
          secondaryReward:
            secondaryRewards?.map(({ rewards }) => rewards) || [],
          amount: removeAmount,
          stakeAccount: walletStakeAccount,
        });
        if (!unstakeResult) throw new Error('Unstake failed');
        setTransactionsLeft(1);
      }

      const removeLiquidityResult = await removeRaydiumLiquidity(removeAmount);
      if (!removeLiquidityResult) {
        throw new Error('Removing liquidity failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
      setTransactionsLeft(null);
    }
  };

  return (
    <>
      <div
        className={classNames({
          [styles.wrapper]: true,
          [styles.visible]: visible,
        })}
      >
        {visible && (
          <div
            className={styles.closeModalIcon}
            onClick={() => setVisible(false)}
          >
            <CloseModalIcon className={styles.closeIcon} />
          </div>
        )}
        <ModalHeader
          headerText="Withdraw"
          slippage={0}
          setSlippage={() => {}}
          showSlippageDropdown={false}
        />

        <TokenAmountInputWithBalance
          className={styles.tokenAmountInputWithBalance}
          value={lpValue}
          setValue={onLpValueChange}
          tokenTicker={lpTokenSymbol}
          balance={lpTokenBalance ? lpTokenBalance?.toFixed(3) : '0'}
          error={notEnoughLpTokenError}
        />

        <Slider
          className={styles.slider}
          value={percent}
          setValue={lpTokenBalance && onPercentChange}
        />

        <div className={styles.errors}>
          {notEnoughLpTokenError && <p>Not enough {lpTokenSymbol}</p>}
        </div>

        <SubmitButton
          disabled={submitButtonDisabled}
          text="Withdraw liquidity"
          onClick={() => onSubmit()}
        />
      </div>
      <LoadingModal
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
        subtitle={`Time gap between transactions can be up to 1 minute.\nTransactions left: ${transactionsLeft}`}
      />
    </>
  );
};
