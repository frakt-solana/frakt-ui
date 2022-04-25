import { TokenInfo } from '@solana/spl-token-registry';
import BN from 'bn.js';
import classNames from 'classnames';
import { FC, useState } from 'react';

import {
  LoadingModal,
  useLoadingModal,
} from '../../../../../components/LoadingModal';
import { TokenAmountInputWithBalance } from '../../../../../components/TokenAmountInputWithBalance';
import {
  FusionPool,
  useCurrentSolanaPrice,
  useLiquidityPools,
} from '../../../../../contexts/liquidityPools';
import { useSplTokenBalance } from '../../../../../utils/accounts';
import {
  EstimatedRewards,
  ModalClose,
  ModalHeader,
  SubmitButton,
  TotalUSD,
} from '../../../components/ModalParts';
import { usePoolTokenPrice } from '../../hooks';
import styles from './StakePoolTokenModal.module.scss';

interface StakePoolTokenModalProps {
  visible?: boolean;
  setVisible?: (nextValue: boolean) => void;
  poolToken: TokenInfo;
  apr?: number;
  inventoryFusionPool: FusionPool;
}

export const StakePoolTokenModal: FC<StakePoolTokenModalProps> = ({
  visible = false,
  poolToken,
  apr = 0,
  setVisible = () => {},
  inventoryFusionPool,
}) => {
  const [value, setValue] = useState<string>('');
  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);

  const { stakeLiquidity: stakeLiquidityTxn } = useLiquidityPools();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const { balance: poolTokenBalance } = useSplTokenBalance(
    poolToken?.address,
    poolToken?.decimals,
  );

  const { poolTokenPrice } = usePoolTokenPrice(poolToken);
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();

  const totalValueUSD =
    parseFloat(value) * parseFloat(poolTokenPrice) * currentSolanaPriceUSD;

  const notEnoughPoolTokenError = parseFloat(value) > poolTokenBalance;

  const submitButtonDisabled = notEnoughPoolTokenError;

  const stakeLiquidity = async (): Promise<boolean> => {
    const amount = new BN(parseFloat(value) * 10 ** poolToken.decimals);

    const result = await stakeLiquidityTxn({
      amount,
      router: inventoryFusionPool?.router,
    });

    return !!result;
  };

  const onSubmit = async () => {
    try {
      setTransactionsLeft(1);
      openLoadingModal();
      setVisible(false);

      const stakeResult = await stakeLiquidity();
      if (!stakeResult) {
        throw new Error('Stake failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
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
        {visible && <ModalClose onClick={() => setVisible(false)} />}
        <ModalHeader
          headerText="Stake in Inventory"
          slippage={0}
          setSlippage={() => {}}
          showSlippageDropdown={false}
        />
        <TokenAmountInputWithBalance
          className={styles.tokenAmountInputWithBalance}
          value={value}
          setValue={setValue}
          tokenImage={poolToken?.logoURI}
          tokenTicker={poolToken?.symbol}
          balance={poolTokenBalance ? poolTokenBalance?.toFixed(3) : '0'}
          error={notEnoughPoolTokenError}
        />

        <TotalUSD className={styles.totalUSD} totalValueUSD={totalValueUSD} />

        <EstimatedRewards
          className={styles.estimatedRewards}
          totalValueUSD={totalValueUSD}
          apr={apr}
        />

        <div className={styles.errors}>
          {notEnoughPoolTokenError && <p>Not enough {poolToken?.symbol}</p>}
        </div>

        <SubmitButton
          disabled={submitButtonDisabled}
          text="Stake"
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
