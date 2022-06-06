import { FC, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames';

import {
  LoadingModal,
  useLoadingModal,
} from '../../../../../components/LoadingModal';
import { TokenAmountInputWithBalance } from '../../../../../components/TokenAmountInputWithBalance';
import {
  FusionPool,
  useLiquidityPools,
} from '../../../../../contexts/liquidityPools';
import {
  ModalClose,
  ModalHeader,
  SubmitButton,
} from '../../../components/ModalParts';
import styles from './UnstakeInventoryModal.module.scss';
import { Slider } from '../../../../../components/Slider';

export interface UnstakeInventoryModalProps {
  visible?: boolean;
  setVisible?: (nextValue: boolean) => void;
  poolToken: TokenInfo;
  inventoryFusionPool: FusionPool;
  poolTokensStakedAmount?: number;
}

export const UnstakeInventoryModal: FC<UnstakeInventoryModalProps> = ({
  visible = false,
  setVisible = () => {},
  poolToken,
  poolTokensStakedAmount,
  inventoryFusionPool,
}) => {
  const { unstakeLiquidity } = useLiquidityPools();

  const { publicKey: walletPublicKey } = useWallet();

  const [percent, setPercent] = useState(0);
  const [value, setValue] = useState<string>('');

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const notEnoughLpTokenError = parseFloat(value) > poolTokensStakedAmount;

  const onValueChange = (nextValue: string) => {
    setValue(nextValue);

    const percentOfBalance =
      (parseFloat(nextValue) / poolTokensStakedAmount) * 100;

    if (percentOfBalance >= 0 && percentOfBalance <= 100) {
      setPercent(percentOfBalance);
    } else if (percentOfBalance > 100) {
      setPercent(100);
    } else {
      setPercent(0);
    }
  };

  const onPercentChange = (nextValue: number) => {
    const lpStringValue = (poolTokensStakedAmount * nextValue) / 100;

    setValue(lpStringValue ? lpStringValue?.toFixed(5) : '0');

    setPercent(nextValue);
  };

  const submitButtonDisabled = notEnoughLpTokenError || !percent;

  const onSubmit = async (): Promise<void> => {
    try {
      setVisible(false);

      openLoadingModal();

      const removeAmount = new BN(
        parseFloat(value) * 10 ** poolToken?.decimals,
      );

      const { router, secondaryRewards, stakeAccounts } = inventoryFusionPool;
      const walletStakeAccount = stakeAccounts?.find(
        ({ stakeOwner }) => stakeOwner === walletPublicKey?.toBase58(),
      );

      const unstakeResult = await unstakeLiquidity({
        router,
        secondaryReward: secondaryRewards?.map(({ rewards }) => rewards) || [],
        amount: removeAmount,
        stakeAccount: walletStakeAccount,
      });
      if (!unstakeResult) throw new Error('Unstake failed');
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
          headerText="Unstake"
          slippage={0}
          setSlippage={() => {}}
          showSlippageDropdown={false}
        />

        <TokenAmountInputWithBalance
          className={styles.tokenAmountInputWithBalance}
          value={value}
          setValue={onValueChange}
          tokenImage={poolToken?.logoURI}
          tokenTicker={poolToken?.symbol}
          balance={
            poolTokensStakedAmount ? poolTokensStakedAmount?.toFixed(5) : '0'
          }
          error={notEnoughLpTokenError}
        />

        <Slider
          className={styles.slider}
          value={percent}
          setValue={poolTokensStakedAmount && onPercentChange}
          withTooltip
        />

        <div className={styles.errors}>
          {notEnoughLpTokenError && <p>Not enough {poolToken?.symbol}</p>}
        </div>

        <SubmitButton
          disabled={submitButtonDisabled}
          text="Unstake"
          onClick={() => onSubmit()}
        />
      </div>
      <LoadingModal
        title="Please approve transaction"
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </>
  );
};
