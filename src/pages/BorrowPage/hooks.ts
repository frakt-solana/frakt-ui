import { Dictionary } from 'lodash';
import {
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
  useEffect,
  useCallback,
} from 'react';
import { useDispatch } from 'react-redux';

import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

import { commonActions } from '../../state/common/actions';
import { useFakeInfinityScroll } from '../../components/FakeInfinityScroll';
import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import {
  DISCOUNT_NFT_CREATORS,
  getNftMarketLowerPricesByCreators,
  LoanData,
  useLoans,
  useLoansInitialFetch,
} from '../../contexts/loans';
import { useDebounce } from '../../hooks';
import { getNftCreators, getStakingPointsURL } from '../../utils';

const usePriceByCreator = (creatorsArray = []) => {
  const [priceByCreator, setPriceByCreator] = useState<
    Dictionary<number | null>
  >({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPrices = async (creatorsArray: string[] = []) => {
    try {
      setLoading(true);

      const priceByCreator = await getNftMarketLowerPricesByCreators(
        creatorsArray,
      );

      setPriceByCreator(priceByCreator);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (creatorsArray.length) {
      fetchPrices(creatorsArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatorsArray.length]);

  return {
    priceByCreator,
    loading,
  };
};

const useStakingPoints = (walletAddress: PublicKey) => {
  const [stakingPoints, setStakingPoints] = useState<number>(0);

  const getStakingPoints = useCallback(async (walletAddress) => {
    try {
      const { userScore } = await (
        await fetch(getStakingPointsURL(walletAddress))
      ).json();

      setStakingPoints(Math.floor(userScore / 10));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (walletAddress) {
      void getStakingPoints(walletAddress);
    }
  }, [walletAddress, getStakingPoints]);

  return { stakingPoints };
};

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: UserNFT[];
  setVisible: (nextState: boolean) => void;
  loading: boolean;
  searchItems: (search: string) => void;
  loanData: LoanData;
  priceByCreator: Dictionary<number | null>;
  ltvByCreator: Dictionary<number | null>;
  interestRateDiscountPercent: number;
} => {
  //? Hardcoded util multiple loanPools not implemented
  const loanPoolPubkey = 'FuydvCEeh5sa4YyPzQuoJFBRJ4sF5mwT4rbeaWMi3nuN';

  useLoansInitialFetch();
  const { connected, publicKey } = useWallet();
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const { stakingPoints } = useStakingPoints(publicKey);
  const {
    nfts: rawNfts,
    allNfts: rawNftsWithFrozen,
    loading: userTokensLoading,
    nftsLoading,
    fetchUserNfts,
    rawUserTokensByMint,
  } = useUserTokens();
  const { setItemsToShow } = useFakeInfinityScroll(15);
  const [searchString, setSearchString] = useState<string>('');
  const dispatch = useDispatch();
  const { loanDataByPoolPublicKey, loading: loansLoading } = useLoans();

  useEffect(() => {
    if (
      connected &&
      !userTokensLoading &&
      !nftsLoading &&
      Object.keys(rawUserTokensByMint).length
    ) {
      void fetchUserNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, userTokensLoading, nftsLoading]);

  const interestRateDiscountPercent = useMemo(() => {
    if (rawNftsWithFrozen?.length && !nftsLoading) {
      const amountOfDiscountNfts =
        rawNftsWithFrozen.reduce((amount, nft) => {
          const creators = getNftCreators(nft);

          const isDiscountNft = !!DISCOUNT_NFT_CREATORS?.find((creator) =>
            creators.includes(creator),
          );

          if (isDiscountNft) {
            return amount + 1;
          }

          return amount;
        }, 0) + stakingPoints;

      return amountOfDiscountNfts > 100 ? 100 : amountOfDiscountNfts;
    }

    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawNftsWithFrozen?.length, nftsLoading, stakingPoints]);

  const searchItems = useDebounce((search: string) => {
    setItemsToShow(15);
    setSearchString(search.toUpperCase());
  }, 300);

  const loanData = loanDataByPoolPublicKey.get(loanPoolPubkey);

  const loanDataCollectionsCreators = useMemo(() => {
    if (loanDataByPoolPublicKey?.size) {
      return loanData?.collectionsInfo?.map(({ creator }) => creator);
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanDataByPoolPublicKey?.size, loanPoolPubkey]);

  const { priceByCreator, loading: priceByCreatorLoading } = usePriceByCreator(
    loanDataCollectionsCreators,
  );

  const ltvByCreator = useMemo(() => {
    if (
      priceByCreator &&
      !priceByCreatorLoading &&
      loanDataByPoolPublicKey?.size &&
      loanPoolPubkey
    ) {
      return Object.fromEntries(
        loanData?.collectionsInfo?.map(({ creator, loanToValue }) => {
          const ltv = loanToValue / 1e4 || null;

          return [creator, ltv];
        }),
      );
    }

    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    priceByCreator,
    priceByCreatorLoading,
    loanDataByPoolPublicKey?.size,
    loanPoolPubkey,
  ]);

  const whitelistedNfts = useMemo(() => {
    if (rawNfts?.length && loanDataByPoolPublicKey?.size) {
      return rawNfts?.filter(({ metadata }) => {
        const isSuitable = metadata?.properties?.creators?.find(
          ({ verified, address }) => {
            if (verified) {
              return loanDataCollectionsCreators.includes(address);
            }

            return false;
          },
        );

        return !!isSuitable;
      });
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawNfts, loanDataByPoolPublicKey?.size]);

  const filteredNfts = useMemo(() => {
    return (whitelistedNfts || [])
      .filter(({ metadata }) =>
        metadata?.name?.toUpperCase().includes(searchString),
      )
      .sort(({ metadata: metadataA }, { metadata: metadataB }) =>
        metadataB?.name?.localeCompare(metadataA?.name),
      );
  }, [searchString, whitelistedNfts]);

  const loading =
    userTokensLoading || nftsLoading || loansLoading || priceByCreatorLoading;

  return {
    isCloseSidebar,
    setIsCloseSidebar,
    nfts: filteredNfts,
    setVisible: (arg) =>
      dispatch(commonActions.setWalletModal({ isVisible: arg })),
    loading: connected ? loading : false,
    searchItems,
    loanData,
    priceByCreator,
    ltvByCreator,
    interestRateDiscountPercent,
  };
};
