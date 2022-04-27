import { FC, useState } from 'react';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import {
  LoadingModal,
  useLoadingModal,
} from '../../../../../components/LoadingModal';
import { TokenAmountInputWithBalance } from '../../../../../components/TokenAmountInputWithBalance';
import {
  FusionPool,
  RaydiumPoolInfo,
} from '../../../../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../../../../utils';
import { useSplTokenBalance } from '../../../../../utils/accounts';
import {
  ModalClose,
  ModalHeader,
  SubmitButton,
} from '../../../components/ModalParts';
import styles from './WithdrawLiquidityModal.module.scss';
import { Slider } from '../../../../../components/Slider';
import { unstakeAndRemoveLiquidity } from '../../transactions';

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
  const wallet = useWallet();
  const { connection } = useConnection();

  const [percent, setPercent] = useState(0);
  const [lpValue, setLpValue] = useState<string>('');

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

  const onSubmit = async (): Promise<void> => {
    try {
      openLoadingModal();
      setVisible(false);

      const result = await unstakeAndRemoveLiquidity({
        connection,
        wallet,
        liquidityFusion: liquidityFusionPool,
        poolToken: baseToken,
        raydiumLiquidityPoolKeys,
        raydiumPoolInfo,
        amount: parseFloat(lpValue),
      });

      if (!result) {
        throw new Error('Removing liquidity failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
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
        {visible && <ModalClose onClick={() => setVisible(false)} />}
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
      />
    </>
  );
};
