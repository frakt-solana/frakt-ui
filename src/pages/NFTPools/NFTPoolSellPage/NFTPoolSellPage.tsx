import { useParams } from 'react-router';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';
import BN from 'bn.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

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
import { usePublicKeyParam } from '../../../hooks';
import { NFTPoolNFTsList, SORT_VALUES } from '../components/NFTPoolNFTsList';
import { Loader } from '../../../components/Loader';
import { FilterFormInputsNames } from '../model';
import {
  useNftPoolTokenBalance,
  useNFTsFiltering,
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
  const { poolDataByMint, raydiumSwap } = useLiquidityPools();
  const { connection } = useConnection();
  const { depositNftToCommunityPool } = useNftPools();
  const { removeTokenOptimistic } = useUserTokens();
  const { balance } = useNftPoolTokenBalance(pool);
  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const poolTokenBalanceOnSell = useRef<number>();
  const swapNeeded = useRef<boolean>(false);

  const [slippage, setSlippage] = useState<number>(0.5);
  const [transactionsLeft, setTransactionsLeft] = useState<number>(null);
  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);

  useEffect(() => {
    (async () => {
      if (
        !!poolTokenBalanceOnSell.current &&
        balance > poolTokenBalanceOnSell.current &&
        swapNeeded.current
      ) {
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
          ((100 - SELL_COMMISSION_PERCENT) / 100) *
            10 ** poolTokenInfo?.decimals,
        );

        await raydiumSwap({
          baseToken: poolTokenInfo,
          baseAmount: payAmount,
          quoteToken: SOL_TOKEN,
          quoteAmount: receiveAmountBN,
          poolConfig: poolData?.poolConfig,
        });

        poolTokenBalanceOnSell.current = null;
        swapNeeded.current = false;
        closeLoadingModal();
        setTransactionsLeft(0);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance]);

  const onSelect = (nft: UserNFT) => {
    setSelectedNft((prevNft) => (prevNft?.mint === nft.mint ? null : nft));
  };
  const onDeselect = () => {
    setSelectedNft(null);
  };

  const sell = async (needSwap = false) => {
    setTransactionsLeft(1);
    if (needSwap) {
      setTransactionsLeft(2);
      swapNeeded.current = true;
    }
    openLoadingModal();
    const poolData = poolDataByMint.get(poolTokenInfo.address);
    const poolLpMint = poolData?.poolConfig?.lpMint;

    const result = await depositNftToCommunityPool({
      pool,
      nft: selectedNft,
      poolLpMint,
      afterTransaction: () => {
        removeTokenOptimistic([selectedNft?.mint]);
        onDeselect();
        poolTokenBalanceOnSell.current = balance;
        setTransactionsLeft(1);
        if (!needSwap) {
          closeLoadingModal();
          setTransactionsLeft(null);
        }
      },
    });

    if (!result) {
      closeLoadingModal();
      setTransactionsLeft(null);
    }
  };

  return {
    slippage,
    setSlippage,
    sell,
    poolTokenBalance: balance,
    onSelect,
    onDeselect,
    selectedNft,
    loadingModalVisible,
    closeLoadingModal,
    loadingModalSubtitle: `Transactions left: ${transactionsLeft}`,
  };
};

export const NFTPoolSellPage: FC = () => {
  const { poolPubkey } = useParams<{ poolPubkey: string }>();
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
      rawNfts,
      whitelistedMintsDictionary,
      whitelistedCreatorsDictionary,
    );
  }, [rawNfts, whitelistedMintsDictionary, whitelistedCreatorsDictionary]);

  const { control, nfts } = useNFTsFiltering(whitelistedNFTs);

  const pageLoading = tokensMapLoading || poolLoading || pricesLoading;

  return (
    <NFTPoolPageLayout
      customHeader={
        <HeaderSell
          poolPublicKey={poolPubkey}
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
