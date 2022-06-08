import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  FetchData,
  useInfinityScroll,
} from '../../../components/InfinityScroll';
import { BorrowNFT } from './../../../state/userTokens/types';
import { useDispatch, useSelector } from 'react-redux';
import { userTokensActions } from '../../../state/userTokens/actions';
import { selectBorrowNfts } from '../../../state/userTokens/selectors';

export const useBorrowPage = (): {
  isCloseSidebar: boolean;
  setIsCloseSidebar: Dispatch<SetStateAction<boolean>>;
  nfts: BorrowNFT[];
  loading: boolean;
  searchItems: (search: string) => void;
  setSearch: (searchStr: string) => void;
  next: () => void;
  search: string;
  removeTokenOptimistic: (mints: string[]) => void;
} => {
  const [isCloseSidebar, setIsCloseSidebar] = useState<boolean>(false);
  const [nftsLoading, setNftsLoading] = useState<boolean>(true);
  const wallet = useWallet();
  const dispatch = useDispatch();

  const fetchData: FetchData<BorrowNFT> = async ({
    offset,
    limit,
    searchStr,
  }) => {
    try {
      const URL = `https://fraktion-monorep.herokuapp.com/nft/meta`;
      const isSearch = searchStr ? `search=${searchStr}&` : '';

      const fullURL = `${URL}/${wallet?.publicKey?.toBase58()}?${isSearch}skip=${offset}&limit=${limit}`;
      const response = await fetch(fullURL);
      const nfts = await response.json();

      return nfts || [];
    } catch (error) {
      // eslint-disable-next-line
      console.log(error);
    } finally {
      setNftsLoading(false);
    }
  };

  const {
    next,
    search,
    setSearch,
    items: userWhitelistedNFTs,
    nextDebounced: searchItems,
  } = useInfinityScroll(
    {
      fetchData,
    },
    [wallet],
  );

  const filteredNfts = useMemo(() => {
    return (userWhitelistedNFTs || []).sort(
      ({ name: nameA }, { name: nameB }) => nameA?.localeCompare(nameB),
    );
  }, [userWhitelistedNFTs]);

  const removeTokenOptimistic = (mints: string[]): void => {
    const patchedNfts = filteredNfts.filter((nft) => {
      return !mints.includes(nft.mint);
    });

    dispatch(userTokensActions.setBorrowNfts(patchedNfts));
  };

  const rawNfts = useSelector(selectBorrowNfts);
  const nfts = Object.values(rawNfts);

  const loading = nftsLoading;

  return {
    isCloseSidebar,
    setIsCloseSidebar,
    nfts: nfts.length ? nfts : filteredNfts,
    loading,
    setSearch,
    next,
    searchItems,
    search,
    removeTokenOptimistic,
  };
};
