import { FC, useMemo, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';
import BN from 'bn.js';

import styles from './NFTPoolSwapPage.module.scss';
import { HeaderSwap } from './components/HeaderSwap';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { WalletNotConnected } from '../components/WalletNotConnected';
import { usePublicKeyParam } from '../../../hooks';
import {
  filterWhitelistedNFTs,
  useNftPool,
  useNftPools,
  useNftPoolsInitialFetch,
} from '../../../contexts/nftPools';
import { UserNFT, useUserTokens } from '../../../contexts/userTokens';
import {
  useAPR,
  useNftPoolTokenBalance,
  useNFTsFiltering,
  usePoolPubkeyParam,
  usePoolTokensPrices,
  useUserRawNfts,
} from '../hooks';
import { FilterFormInputsNames } from '../model';
import { Loader } from '../../../components/Loader';
import { SwapModal } from './components/SwapModal';
import { NftPoolData } from '../../../utils/cacher/nftPools';
import {
  NFTPoolPageLayout,
  PoolPageType,
} from '../components/NFTPoolPageLayout';
import { useTokenListContext } from '../../../contexts/TokenList';
import { useLiquidityPools } from '../../../contexts/liquidityPools';
import {
  LoadingModal,
  useLoadingModal,
} from '../../../components/LoadingModal';
import { SELL_COMMISSION_PERCENT } from '../constants';
import { getTokenPrice } from '../helpers';
import { SOL_TOKEN } from '../../../utils';

const useNftsSwap = ({
  pool,
  poolTokenInfo,
}: {
  pool: NftPoolData;
  poolTokenInfo: TokenInfo;
}) => {
  const { poolDataByMint, raydiumSwap } = useLiquidityPools();
  const { connection } = useConnection();
  const { depositNftToCommunityPool, getLotteryTicket } = useNftPools();
  const { removeTokenOptimistic } = useUserTokens();
  const { balance } = useNftPoolTokenBalance(pool);
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const [slippage, setSlippage] = useState<number>(0.5);
  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);
  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);

  const depositNft = async (): Promise<boolean> => {
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

    return result;
  };

  const buyPoolToken = async (): Promise<boolean> => {
    const poolData = poolDataByMint.get(poolTokenInfo.address);

    const { amountWithSlippage: payAmount } = await getTokenPrice({
      poolData,
      slippage: slippage || 1,
      isBuy: true,
      connection,
    });

    const payAmountBN = new BN(
      parseFloat(payAmount) *
        (SELL_COMMISSION_PERCENT / 100) *
        10 ** poolTokenInfo.decimals,
    );

    const receiveAmountBN = new BN(
      (SELL_COMMISSION_PERCENT / 100) * 10 ** SOL_TOKEN.decimals,
    );

    const result = await raydiumSwap({
      quoteToken: poolTokenInfo,
      quoteAmount: receiveAmountBN,
      baseToken: SOL_TOKEN,
      baseAmount: payAmountBN,
      poolConfig: poolData?.poolConfig,
    });

    return !!result;
  };

  const buyNft = async (): Promise<boolean> => {
    const poolData = poolDataByMint.get(poolTokenInfo.address);
    const poolLpMint = poolData?.poolConfig?.lpMint;

    const result = await getLotteryTicket({ pool, poolLpMint });

    return !!result;
  };

  const swap = async (needSwap = false) => {
    try {
      if (needSwap) {
        setTransactionsLeft(3);
      } else {
        setTransactionsLeft(2);
      }

      openLoadingModal();

      const isDepositSuccessful = await depositNft();
      if (!isDepositSuccessful) {
        throw new Error('NFT deposit failed');
      }

      setTransactionsLeft((prevValue) => prevValue - 1);

      if (isDepositSuccessful && needSwap) {
        const isRaydiumSwapSuccessful = await buyPoolToken();

        if (!isRaydiumSwapSuccessful) {
          throw new Error('Raydium swap failed');
        }

        setTransactionsLeft((prevValue) => prevValue - 1);
      }

      const isLotterySuccessful = await buyNft();
      if (!isLotterySuccessful) {
        throw new Error('Lottery failed');
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
    swap,
    poolTokenBalance: balance,
    onSelect,
    onDeselect,
    selectedNft,
    loadingModalVisible,
    closeLoadingModal,
    loadingModalSubtitle: `Time gap between transactions can be up to 1 minute.\nTransactions left: ${transactionsLeft}`,
  };
};

export const NFTPoolSwapPage: FC = () => {
  const poolPubkey = usePoolPubkeyParam();
  usePublicKeyParam(poolPubkey);

  useNftPoolsInitialFetch();

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

  const { connected } = useWallet();

  const {
    slippage,
    setSlippage,
    swap,
    poolTokenBalance: balance,
    onSelect,
    onDeselect,
    selectedNft,
    loadingModalVisible,
    closeLoadingModal,
    loadingModalSubtitle,
  } = useNftsSwap({ pool, poolTokenInfo });

  const { rawNfts, rawNftsLoading: contentLoading } = useUserRawNfts();

  const {
    pricesByTokenMint: poolTokenPricesByTokenMint,
    loading: pricesLoading,
  } = usePoolTokensPrices([poolTokenInfo]);

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

  const poolTokenAvailable = balance >= SELL_COMMISSION_PERCENT / 100;

  const pageLoading =
    poolLoading || tokensMapLoading || pricesLoading || aprLoading;

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderSwap
          pool={pool}
          poolTokenInfo={poolTokenInfo}
          poolTokenPrice={
            poolTokenPricesByTokenMint?.get(poolTokenInfo?.address)?.buy
          }
          hidden={pageLoading}
        />
      }
      pageType={PoolPageType.SWAP}
    >
      {pageLoading ? (
        <Loader size="large" />
      ) : (
        <>
          {!connected && <WalletNotConnected type="swap" />}
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
            <SwapModal
              nft={selectedNft}
              onDeselect={onDeselect}
              onSubmit={swap}
              randomPoolImage={poolTokenInfo?.logoURI}
              poolTokenAvailable={poolTokenAvailable}
              poolTokenInfo={poolTokenInfo}
              poolTokenPrice={
                poolTokenPricesByTokenMint.get(poolTokenInfo?.address)?.buy
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
