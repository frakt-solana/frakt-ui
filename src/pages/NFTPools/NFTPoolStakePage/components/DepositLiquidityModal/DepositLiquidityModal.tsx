import { FC, useState } from 'react';
import classNames from 'classnames';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TokenInfo } from '@solana/spl-token-registry';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { utils } from '@frakt-protocol/frakt-sdk';

import {
  EstimatedRewards,
  ModalClose,
  ModalHeader,
  SubmitButton,
  TotalUSD,
} from '../../../components/ModalParts';
import styles from './DepositLiquidityModal.module.scss';
import { TokenAmountInputWithBalance } from '../../../../../components/TokenAmountInputWithBalance';
import {
  useNativeAccount,
  useSplTokenBalance,
} from '../../../../../utils/accounts';
import { SOL_TOKEN } from '../../../../../utils';
import {
  FusionPool,
  RaydiumPoolInfo,
  useCurrentSolanaPrice,
} from '../../../../../contexts/liquidityPools';
import {
  LoadingModal,
  useLoadingModal,
} from '../../../../../components/LoadingModal';
import { provideLiquidity, stakeInLiquidityFusion } from '../../transactions';
import { useConnection } from '../../../../../hooks';
import { usePoolTokenPrice } from '../../hooks';

interface DepositLiquidityModalProps {
  visible?: boolean;
  setVisible?: (nextValue: boolean) => void;
  baseToken: TokenInfo;
  raydiumPoolInfo: RaydiumPoolInfo;
  apr?: number;
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
  liquidityFusionPool: FusionPool;
}

export const calcRatio = (raydiumPoolInfo: RaydiumPoolInfo): number =>
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
  const wallet = useWallet();
  const walletPublicKey = wallet?.publicKey;

  const connection = useConnection();
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();
  const { poolTokenPrice } = usePoolTokenPrice(baseToken);

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

  const totalValueUSD =
    (parseFloat(baseValue) * parseFloat(poolTokenPrice) +
      parseFloat(solValue)) *
    currentSolanaPriceUSD;

  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const onSubmit = async () => {
    try {
      setTransactionsLeft(2);
      openLoadingModal();
      setVisible(false);

      const addRaydiumLiquidityResult = await provideLiquidity({
        connection,
        wallet,
        poolToken: baseToken,
        poolTokenAmount: parseFloat(baseValue),
        raydiumLiquidityPoolKeys,
        raydiumPoolInfo,
      });

      if (!addRaydiumLiquidityResult) {
        throw new Error('Providing liquidity failed');
      }

      setTransactionsLeft(1);

      const { accountInfo } = await utils.getTokenAccount({
        tokenMint: new PublicKey(liquidityFusionPool?.router?.tokenMintInput),
        owner: walletPublicKey,
        connection,
      });

      const stakeResult = await stakeInLiquidityFusion({
        amount: accountInfo?.amount,
        connection,
        wallet,
        liquidityFusionPool,
      });

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
          headerText={`Stake ${baseToken?.symbol}/SOL`}
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

        <TotalUSD className={styles.totalUSD} totalValueUSD={totalValueUSD} />

        <EstimatedRewards
          className={styles.estimatedRewards}
          totalValueUSD={totalValueUSD}
          apr={apr}
        />

        <div className={styles.errors}>
          {notEnoughBaseTokenError && <p>Not enough {baseToken?.symbol}</p>}
          {notEnoughSOLError && <p>Not enough SOL</p>}
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
