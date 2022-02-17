import React, { useContext, useEffect, useState } from 'react';
import { getAllUserTokens } from 'solana-nft-metadata';
import { keyBy } from 'lodash';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import {
  nftsByMint,
  RawUserTokensByMint,
  UserNFT,
  UserTokensInterface,
  UseUserTokensInterface,
} from './userTokens.model';
import { getArweaveMetadataByMint } from '../../utils/getArweaveMetadata';

const UserTokensContext = React.createContext<UserTokensInterface>({
  nfts: [],
  nftsByMint: {},
  rawUserTokensByMint: {},
  loading: false,
  removeTokenOptimistic: () => {},
  refetch: () => Promise.resolve(null),
});

export const UserTokensProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [nfts, setNfts] = useState<UserNFT[]>([]);
  const [nftsByMint, setNftsByMint] = useState<nftsByMint>({});
  const [rawUserTokensByMint, setRawUserTokensByMint] =
    useState<RawUserTokensByMint>({});

  const [loading, setLoading] = useState<boolean>(false);

  const clearTokens = () => {
    setNfts([]);
    setNftsByMint({});
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

      const mints = Object.keys(rawUserTokensByMint);
      const arweaveMetadata = await getArweaveMetadataByMint(mints);

      const tokensArray = Object.entries(arweaveMetadata).map(
        ([mint, metadata]) => ({
          mint,
          metadata,
        }),
      );

      //TODO fetch nft metadata only by call
      setNftsByMint(arweaveMetadata);
      setNfts(tokensArray);
      setRawUserTokensByMint(rawUserTokensByMint);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeTokenOptimistic = (mints: string[]): void => {
    const nftEntries = Object.entries(nftsByMint).filter(
      ([key]) => !mints.includes(key),
    );
    const patchedRawUserTokensByMint = Object.fromEntries(
      Object.entries(rawUserTokensByMint).filter(
        ([key]) => !mints.includes(key),
      ),
    );

    const patchedNfts = nftEntries.map(([mint, metadata]) => ({
      mint,
      metadata,
    }));
    const patchedNftsByMint: nftsByMint = Object.fromEntries(nftEntries);

    setNfts(patchedNfts);
    setNftsByMint(patchedNftsByMint);
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
        nftsByMint,
        rawUserTokensByMint,
        loading,
        refetch: fetchTokens,
        removeTokenOptimistic,
      }}
    >
      {children}
    </UserTokensContext.Provider>
  );
};

export const useUserTokens = (): UseUserTokensInterface => {
  const {
    nfts,
    nftsByMint,
    rawUserTokensByMint,
    loading,
    refetch,
    removeTokenOptimistic,
  } = useContext(UserTokensContext);
  return {
    nfts,
    nftsByMint,
    rawUserTokensByMint,
    loading,
    refetch,
    removeTokenOptimistic,
  };
};
