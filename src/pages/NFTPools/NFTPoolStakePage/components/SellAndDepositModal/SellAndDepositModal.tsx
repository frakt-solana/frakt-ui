import { FC, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import classNames from 'classnames';
import { useWallet } from '@solana/wallet-adapter-react';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';

import {
  LoadingModal,
  useLoadingModal,
} from '../../../../../components/LoadingModal';
import {
  FusionPool,
  RaydiumPoolInfo,
  useCurrentSolanaPrice,
} from '../../../../../contexts/liquidityPools';
import {
  UserNFTWithCollection,
  useUserTokens,
} from '../../../../../contexts/userTokens';
import { SOL_TOKEN } from '../../../../../utils';
import {
  EstimatedRewards,
  ItemContent,
  ModalHeader,
  SubmitButton,
  TotalUSD,
} from '../../../components/ModalParts';
import { SELL_COMMISSION_PERCENT } from '../../../constants';
import { usePoolTokenPrice } from '../../hooks';
import styles from './SellAndDepositModal.module.scss';
import { NftPoolData } from '../../../../../utils/cacher/nftPools';
import { TokenAmountInput } from '../../../../../components/TokenAmountInput';
import { calcRatio } from '../DepositLiquidityModal';
import {
  getTokenAccount,
  useNativeAccount,
} from '../../../../../utils/accounts';
import { sellNftAndDeposit, stakeInLiquidityFusion } from '../../transactions';
import { useConnection } from '../../../../../hooks';

interface SellAndDepositModalProps {
  visible?: boolean;
  pool: NftPoolData;
  poolToken: TokenInfo;
  nft?: UserNFTWithCollection;
  apr?: number;
  liquidityFusionPool: FusionPool;
  raydiumPoolInfo: RaydiumPoolInfo;
  raydiumLiquidityPoolKeys: LiquidityPoolKeysV4;
  onDeselect?: () => void;
}

export const SellAndDepositModal: FC<SellAndDepositModalProps> = ({
  visible = false,
  pool,
  poolToken,
  nft,
  apr = 0,
  onDeselect,
  raydiumPoolInfo,
  raydiumLiquidityPoolKeys,
  liquidityFusionPool,
}) => {
  const wallet = useWallet();
  const connection = useConnection();
  const { removeTokenOptimistic } = useUserTokens();

  const sellValue = 1 - SELL_COMMISSION_PERCENT / 100;

  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const { poolTokenPrice } = usePoolTokenPrice(poolToken);
  const { currentSolanaPriceUSD } = useCurrentSolanaPrice();

  const onSubmit = async () => {
    try {
      setTransactionsLeft(2);
      openLoadingModal();

      //Txn here
      const sellAndDepositResult = await sellNftAndDeposit({
        wallet,
        connection,
        pool,
        nft,
        poolToken,
        liquidityFusionPool,
        raydiumLiquidityPoolKeys,
        raydiumPoolInfo,
      });

      if (!sellAndDepositResult) {
        throw new Error('Liquidity providing failed');
      }

      removeTokenOptimistic([nft?.mint]);
      onDeselect();
      setTransactionsLeft(1);

      const { accountInfo } = await getTokenAccount({
        tokenMint: new PublicKey(liquidityFusionPool?.router?.tokenMintInput),
        owner: wallet.publicKey,
        connection,
      });

      const stakeResult = await stakeInLiquidityFusion({
        amount: accountInfo?.amount,
        connection,
        liquidityFusionPool,
        wallet,
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

  const { account } = useNativeAccount();
  const solBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  const solValue = sellValue * calcRatio(raydiumPoolInfo);

  const totalValueUSD =
    (sellValue * parseFloat(poolTokenPrice) + solValue) * currentSolanaPriceUSD;

  const notEnoughSOLError = solValue > solBalance;

  const submitButtonDisabled = notEnoughSOLError;

  return (
    <>
      <div
        className={classNames({
          [styles.wrapper]: true,
          [styles.visible]: visible,
        })}
      >
        <ModalHeader
          headerText="Sell NFT & Stake"
          slippage={0}
          setSlippage={() => {}}
          showSlippageDropdown={false}
        />

        <ItemContent
          className={styles.itemContent}
          name={nft?.metadata.name}
          image={nft?.metadata.image}
          collectionName={nft?.collectionName}
          onDeselect={onDeselect}
        />

        <div className={styles.tokenAmountInputWithBalanceWrapper}>
          <TokenAmountInput
            className={styles.tokenAmountInputWithBalance}
            value={solValue.toFixed(3)}
            setValue={() => {}}
            tokenImage={SOL_TOKEN.logoURI}
            tokenTicker={SOL_TOKEN.symbol}
            error={notEnoughSOLError}
          />
        </div>

        <TotalUSD className={styles.totalUSD} totalValueUSD={totalValueUSD} />

        <EstimatedRewards
          className={styles.estimatedRewards}
          totalValueUSD={totalValueUSD}
          apr={apr}
        />

        <div className={styles.errors}>
          {notEnoughSOLError && <p>Not enough SOL</p>}
        </div>

        <SubmitButton
          disabled={submitButtonDisabled}
          text={`Stake ${poolToken?.symbol || ''}/SOL`}
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
