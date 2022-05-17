import React, { useEffect, useState } from 'react';
import { keyBy, isArray } from 'lodash';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import {
  RawUserTokensByMint,
  UserNFT,
  UserTokensValues,
} from './userTokens.model';
import { fetchNftsWithFallback, isTokenFrozen } from './userTokens.helpers';
import { getAllUserTokens } from '../../utils/accounts';

export const UserTokensContext = React.createContext<UserTokensValues>({
  nfts: [],
  allNfts: [],
  rawUserTokensByMint: {},
  loading: false,
  nftsLoading: false,
  removeTokenOptimistic: () => {},
  refetch: () => Promise.resolve(null),
  fetchUserNfts: () => Promise.resolve(null),
});

export const UserTokensProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [rawUserTokensByMint, setRawUserTokensByMint] =
    useState<RawUserTokensByMint>({});
  const [loading, setLoading] = useState<boolean>(false);

  const [nftsLoading, setNftsLoading] = useState<boolean>(false);
  const [nfts, setNfts] = useState<UserNFT[]>(null);
  const [allNfts, setAllNfts] = useState<UserNFT[]>(null);

  const clearTokens = () => {
    setNfts(null);
    setRawUserTokensByMint({});
    setLoading(false);
  };

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const userTokens = await getAllUserTokens({
        walletPublicKey: publicKey,
        connection,
      });

      const rawUserTokensByMint = keyBy(userTokens, 'mint');

      setRawUserTokensByMint(rawUserTokensByMint);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNfts = async () => {
    if (isArray(nfts)) return;
    setNftsLoading(true);
    try {
      const possibleNftTokens = Object.entries(rawUserTokensByMint)
        ?.filter(([, token]) => token.amount === 1)
        .map(([, token]) => token);

      const frozenNFTsMints = possibleNftTokens
        .filter((token) => isTokenFrozen(token))
        .map(({ mint }) => mint);

      const userNFTs = await fetchNftsWithFallback({
        walletPublicKey: publicKey,
        rawUserTokensByMint,
      });

      const userNFTsFrozen = userNFTs?.filter(({ mint }) =>
        frozenNFTsMints.includes(mint),
      );

      const userNFTsNotFrozen = userNFTs?.filter(
        ({ mint }) => !frozenNFTsMints.includes(mint),
      );

      setNfts(userNFTsNotFrozen);
      setAllNfts([...userNFTsNotFrozen, ...userNFTsFrozen]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setNftsLoading(false);
    }
  };

  const removeTokenOptimistic = (mints: string[]): void => {
    const patchedRawUserTokensByMint = Object.fromEntries(
      Object.entries(rawUserTokensByMint).filter(
        ([key]) => !mints.includes(key),
      ),
    );

    const patchedNfts = nfts.filter((nft) => {
      return !mints.includes(nft.mint);
    });

    setNfts(patchedNfts);
    setRawUserTokensByMint(patchedRawUserTokensByMint);
  };

  useEffect(() => {
    connected && fetchTokens();
    return () => clearTokens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return (
    <UserTokensContext.Provider
      value={{
        nfts,
        allNfts,
        rawUserTokensByMint,
        loading,
        refetch: fetchTokens,
        removeTokenOptimistic,
        fetchUserNfts,
        nftsLoading,
      }}
    >
      {children}
    </UserTokensContext.Provider>
  );
};
