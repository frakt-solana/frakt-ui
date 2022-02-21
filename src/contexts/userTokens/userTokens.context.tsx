import React, { useEffect, useState } from 'react';
import { getAllUserTokens } from 'solana-nft-metadata';
import { keyBy } from 'lodash';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import {
  RawUserTokensByMint,
  UserNFT,
  UserTokensValues,
} from './userTokens.model';
import { getArweaveMetadataByMint } from '../../utils/getArweaveMetadata';

export const UserTokensContext = React.createContext<UserTokensValues>({
  nfts: [],
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
  const [nfts, setNfts] = useState<UserNFT[]>([]);

  const clearTokens = () => {
    setNfts([]);
    setRawUserTokensByMint({});
    setLoading(false);
  };

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const userTokens = await getAllUserTokens(publicKey, {
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
    if (nfts.length) return;
    setNftsLoading(true);
    try {
      const mints = Object.entries(rawUserTokensByMint)
        .filter(([, tokenView]) => tokenView.amount === 1)
        .map(([mint]) => mint);

      const arweaveMetadata = await getArweaveMetadataByMint(mints);

      const tokensArray = Object.entries(arweaveMetadata).map(
        ([mint, metadata]) => ({
          mint,
          metadata,
        }),
      );

      setNfts(tokensArray);
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
