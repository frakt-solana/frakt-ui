import { FC, useMemo, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';

import { HeaderSell } from './components/HeaderSell';
import { SellingModal } from './components/SellingModal';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { UserNFT, useUserTokens } from '../../../contexts/userTokens';
import styles from './NFTPoolSellPage.module.scss';
import {
  filterWhitelistedNFTs,
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
import { useConnection, usePublicKeyParam } from '../../../hooks';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { Loader } from '../../../components/Loader';
import { FilterFormInputsNames } from '../model';
import {
  useAPR,
  useNFTsFiltering,
  usePoolPubkeyParam,
  usePoolTokensPrices,
  useUserRawNfts,
} from '../hooks';
import {
  NFTPoolPageLayout,
  PoolPageType,
} from '../components/NFTPoolPageLayout';
import { useTokenListContext } from '../../../contexts/TokenList';
import { useLiquidityPools } from '../../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../../utils';
import { getTokenPrice } from '../helpers';
import { SELL_COMMISSION_PERCENT } from '../constants';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import {
  LoadingModal,
  useLoadingModal,
} from '../../../components/LoadingModal';

const useNftSell = ({
  pool,
  poolTokenInfo,
}: {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
}) => {
  const { poolDataByMint, raydiumSwap: raydiumSwapTx } = useLiquidityPools();
  const connection = useConnection();
  const { depositNftToCommunityPool } = useNftPools();
  const { removeTokenOptimistic } = useUserTokens();
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const [slippage, setSlippage] = useState<number>(0.5);
  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);
  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);

  const raydiumSwap = async (): Promise<boolean> => {
    const poolData = poolDataByMint.get(poolTokenInfo.address);

    const { amountWithSlippage: receiveAmount } = await getTokenPrice({
      poolData,
      slippage: slippage || 1,
      isBuy: false,
      connection,
    });

    const receiveAmountBN = new BN(
      parseFloat(receiveAmount) *
        ((100 - SELL_COMMISSION_PERCENT) / 100) *
        10 ** SOL_TOKEN.decimals,
    );

    const payAmount = new BN(
      ((100 - SELL_COMMISSION_PERCENT) / 100) * 10 ** poolTokenInfo?.decimals,
    );

    const result = await raydiumSwapTx({
      baseToken: poolTokenInfo,
      baseAmount: payAmount,
      quoteToken: SOL_TOKEN,
      quoteAmount: receiveAmountBN,
      poolConfig: poolData?.poolConfig,
    });

    return !!result;
  };

  const depositNFT = async (): Promise<boolean> => {
    const poolData = poolDataByMint.get(poolTokenInfo.address);
    const poolLpMint = poolData?.poolConfig?.lpMint;

    const result = await depositNftToCommunityPool({
      pool,
      nft: selectedNft,
      poolLpMint,
      afterTransaction: () => {
        removeTokenOptimistic([selectedNft?.mint]);
        onDeselect();
      },
    });

    return !!result;
  };

  const sell = async (needSwap = false) => {
    try {
      setTransactionsLeft(1);
      if (needSwap) {
        setTransactionsLeft(2);
      }
      openLoadingModal();

      const isDepositSuccessful = await depositNFT();
      if (!isDepositSuccessful) {
        throw new Error('NFT deposit failed');
      }

      if (isDepositSuccessful && needSwap) {
        setTransactionsLeft(1);
        const isRaydiumSwapSuccessful = await raydiumSwap();

        if (!isRaydiumSwapSuccessful) {
          throw new Error('Raydium swap failed');
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
      setTransactionsLeft(null);
    }
  };

  const onSelect = (nft: UserNFT) => {
    setSelectedNft((prevNft) => (prevNft?.mint === nft.mint ? null : nft));
  };
  const onDeselect = () => {
    setSelectedNft(null);
  };

  return {
    slippage,
    setSlippage,
    sell,
    onSelect,
    onDeselect,
    selectedNft,
    loadingModalVisible,
    closeLoadingModal,
    loadingModalSubtitle: `Time gap between transactions can be up to 1 minute.\nTransactions left: ${transactionsLeft}`,
  };
};

export const NFTPoolSellPage: FC = () => {
  const poolPubkey = usePoolPubkeyParam();
  usePublicKeyParam(poolPubkey);
  useNftPoolsInitialFetch();

  const { connected } = useWallet();

  const {
    pool,
    whitelistedMintsDictionary,
    whitelistedCreatorsDictionary,
    loading: poolLoading,
  } = useNftPool(poolPubkey);

  const poolPublicKey = pool?.publicKey?.toBase58();
  const { loading: tokensMapLoading, fraktionTokensMap: tokensMap } =
    useTokenListContext();

  const poolTokenInfo = useMemo(() => {
    return tokensMap.get(pool?.fractionMint?.toBase58());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolPublicKey, tokensMap]);

  const { rawNfts, rawNftsLoading: contentLoading } = useUserRawNfts();

  const {
    pricesByTokenMint: poolTokenPricesByTokenMint,
    loading: pricesLoading,
  } = usePoolTokensPrices([poolTokenInfo]);

  const {
    slippage,
    setSlippage,
    onSelect,
    onDeselect,
    selectedNft,
    sell,
    loadingModalVisible,
    closeLoadingModal,
    loadingModalSubtitle,
  } = useNftSell({ pool, poolTokenInfo });

  const [, setIsSidebar] = useState<boolean>(false);

  const whitelistedNFTs = useMemo(() => {
    return filterWhitelistedNFTs(
      rawNfts || [],
      whitelistedMintsDictionary,
      whitelistedCreatorsDictionary,
    );
  }, [rawNfts, whitelistedMintsDictionary, whitelistedCreatorsDictionary]);

  const { control, nfts } = useNFTsFiltering(whitelistedNFTs);

  const { loading: aprLoading } = useAPR();

  const pageLoading =
    tokensMapLoading || poolLoading || pricesLoading || aprLoading;

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderSell
          pool={pool}
          poolTokenInfo={poolTokenInfo}
          poolTokenPrice={
            poolTokenPricesByTokenMint.get(poolTokenInfo?.address)?.sell
          }
          hidden={pageLoading}
        />
      }
      pageType={PoolPageType.SELL}
    >
      {pageLoading ? (
        <Loader size="large" />
      ) : (
        <>
          {!connected && <WalletNotConnected type="sell" />}
          {connected && !contentLoading && (
            <NFTPoolNFTsList
              nfts={nfts}
              setIsSidebar={setIsSidebar}
              control={control}
              sortFieldName={FilterFormInputsNames.SORT}
              sortValues={SORT_VALUES}
              onCardClick={onSelect}
              selectedNft={selectedNft}
              poolName={poolTokenInfo?.name}
            />
          )}
          {connected && contentLoading && <Loader size="large" />}
          <div className={styles.modalWrapper}>
            <SellingModal
              nft={selectedNft}
              onDeselect={onDeselect}
              onSubmit={sell}
              poolTokenInfo={poolTokenInfo}
              poolTokenPrice={
                poolTokenPricesByTokenMint.get(poolTokenInfo?.address)?.sell
              }
              slippage={slippage}
              setSlippage={setSlippage}
            />
          </div>
          <LoadingModal
            visible={loadingModalVisible}
            onCancel={closeLoadingModal}
            subtitle={loadingModalSubtitle}
          />
        </>
      )}
    </NFTPoolPageLayout>
  );
};
