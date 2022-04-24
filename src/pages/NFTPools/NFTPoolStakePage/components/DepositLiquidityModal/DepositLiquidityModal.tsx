import { FC, useState } from 'react';
import classNames from 'classnames';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import BN from 'bn.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { ModalHeader, SubmitButton } from '../../../components/ModalParts';
import styles from './DepositLiquidityModal.module.scss';
import { TokenAmountInputWithBalance } from '../../../../../components/TokenAmountInputWithBalance';
import {
  getTokenAccount,
  useNativeAccount,
  useSplTokenBalance,
} from '../../../../../utils/accounts';
import { SOL_TOKEN } from '../../../../../utils';
import {
  calculateTotalDeposit,
  formatNumberToCurrency,
  FusionPool,
  RaydiumPoolInfo,
  useCurrentSolanaPrice,
  useLiquidityPools,
} from '../../../../../contexts/liquidityPools';
import { CloseModalIcon } from '../../../../../icons';
import {
  LoadingModal,
  useLoadingModal,
} from '../../../../../components/LoadingModal';

interface DepositLiquidityModalProps {
  visible?: boolean;
  setVisible?: (nextValue: boolean) => void;
  baseToken: TokenInfo;
  raydiumPoolInfo: RaydiumPoolInfo;
  apr?: number;
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
  liquidityFusionPool: FusionPool;
}

const calcRatio = (raydiumPoolInfo: RaydiumPoolInfo) =>
  raydiumPoolInfo?.quoteReserve.toNumber() /
  10 ** raydiumPoolInfo?.quoteDecimals /
  (raydiumPoolInfo?.baseReserve.toNumber() /
    10 ** raydiumPoolInfo?.baseDecimals);

export const DepositLiquidityModal: FC<DepositLiquidityModalProps> = ({
  visible = false,
  setVisible = () => {},
  baseToken,
  raydiumPoolInfo,
  apr = 0,
  raydiumLiquidityPoolKeys,
  liquidityFusionPool,
}) => {
  const { publicKey: walletPublicKey } = useWallet();
  const { connection } = useConnection();
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();

  const [baseValue, setBaseValue] = useState<string>('');
  const [solValue, setSolValue] = useState<string>('');

  const onBaseValueChange = (value: string) => {
    setBaseValue(value);
    const ratio = calcRatio(raydiumPoolInfo);
    const amount = Number(value) * ratio;
    setSolValue(amount ? amount.toFixed(5) : '');
  };
  const onSolValueChange = (value: string) => {
    setSolValue(value);
    const ratio = calcRatio(raydiumPoolInfo);
    const amount = Number(value) / ratio;
    setBaseValue(amount ? amount.toFixed(5) : '');
  };

  const { balance: baseTokenBalance } = useSplTokenBalance(
    baseToken?.address,
    baseToken?.decimals,
  );

  const { account } = useNativeAccount();
  const solBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  const notEnoughBaseTokenError = parseFloat(baseValue) > baseTokenBalance;
  const notEnoughSOLError = parseFloat(solValue) > solBalance;

  const submitButtonDisabled =
    notEnoughBaseTokenError ||
    notEnoughSOLError ||
    !parseFloat(baseValue) ||
    !parseFloat(solValue);

  const totalValueUSD = calculateTotalDeposit(
    solValue,
    baseValue,
    currentSolanaPriceUSD,
  );

  const { addRaydiumLiquidity: addRaydiumLiquidityTxn } = useLiquidityPools();
  const { stakeLiquidity: stakeLiquidityTxn } = useLiquidityPools();
  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const addRaydiumLiquidity = async () => {
    const baseAmount = new BN(parseFloat(baseValue) * 10 ** baseToken.decimals);
    const quoteAmount = new BN(parseFloat(solValue) * 10 ** SOL_TOKEN.decimals);

    const result = await addRaydiumLiquidityTxn({
      baseToken,
      baseAmount,
      quoteToken: SOL_TOKEN,
      quoteAmount,
      poolConfig: raydiumLiquidityPoolKeys,
      fixedSide: 'a',
    });

    setTransactionsLeft(1);

    return !!result;
  };

  const stakeLiquidity = async (): Promise<boolean> => {
    const { accountInfo } = await getTokenAccount({
      tokenMint: new PublicKey(liquidityFusionPool?.router?.tokenMintInput),
      owner: walletPublicKey,
      connection,
    });

    const result = await stakeLiquidityTxn({
      amount: accountInfo?.amount,
      router: liquidityFusionPool?.router,
    });

    return !!result;
  };

  const onSubmit = async () => {
    try {
      setTransactionsLeft(2);
      openLoadingModal();
      setVisible(false);

      const addRaydiumLiquidityResult = await addRaydiumLiquidity();
      if (!addRaydiumLiquidityResult) {
        throw new Error('Providing liquidity failed');
      }

      setTransactionsLeft(1);

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
        {visible && (
          <div
            className={styles.closeModalIcon}
            onClick={() => setVisible(false)}
          >
            <CloseModalIcon className={styles.closeIcon} />
          </div>
        )}
        <ModalHeader
          headerText="Deposit"
          slippage={0}
          setSlippage={() => {}}
          showSlippageDropdown={false}
        />

        <TokenAmountInputWithBalance
          className={styles.tokenAmountInputWithBalance}
          value={baseValue}
          setValue={(value) => onBaseValueChange(value)}
          tokenImage={baseToken?.logoURI}
          tokenTicker={baseToken?.symbol}
          balance={baseTokenBalance ? baseTokenBalance?.toFixed(3) : '0'}
          error={notEnoughBaseTokenError}
        />

        <TokenAmountInputWithBalance
          className={styles.tokenAmountInputWithBalance}
          value={solValue}
          setValue={(value) => onSolValueChange(value)}
          tokenImage={SOL_TOKEN.logoURI}
          tokenTicker={SOL_TOKEN.symbol}
          balance={solBalance ? solBalance?.toFixed(3) : '0'}
          error={notEnoughSOLError}
        />

        <div className={styles.totalUSD}>
          <p>Total</p>
          {formatNumberToCurrency(totalValueUSD)}
        </div>

        <div className={styles.estimatedRewards}>
          <p className={styles.estimatedRewardsTitle}>
            Estimated earnings from fees (7d)
          </p>
          <div className={styles.estimatedRewardsValues}>
            <p>
              {formatNumberToCurrency((totalValueUSD * apr) / 100)}{' '}
              <span className={styles.bold}>/ month</span>
            </p>
            <p>
              {apr && apr.toFixed(2)} % <span className={styles.bold}>APR</span>
            </p>
          </div>
        </div>

        <div className={styles.errors}>
          {notEnoughBaseTokenError && <p>Not enough {baseToken?.symbol}</p>}
          {notEnoughSOLError && <p>Not enough SOL</p>}
        </div>

        <SubmitButton
          disabled={submitButtonDisabled}
          text="Provide liquidity"
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
