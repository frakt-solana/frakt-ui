import React, { useEffect, useState } from 'react';
import { keyBy, isArray } from 'lodash';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import {
  RawUserTokensByMint,
  UserNFT,
  UserTokensValues,
} from './userTokens.model';
import { fetchNftsWithFallback } from './userTokens.helpers';
import { getAllUserTokens } from '../../utils/accounts';

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
  const [nfts, setNfts] = useState<UserNFT[]>(null);

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
      const frozenNFTsMints = Object.entries(rawUserTokensByMint)
        ?.filter(([, token]) => {
          //? token.state === 2 for freezed accounts
          return token.amount === 1 && token.state === 2;
        })
        ?.map(([mint]) => mint);

      const userNFTs = await fetchNftsWithFallback({
        walletPublicKey: publicKey,
        rawUserTokensByMint,
      });

      const userNFTsNotFrozen = userNFTs?.filter(
        ({ mint }) => !frozenNFTsMints.includes(mint),
      );

      setNfts(userNFTsNotFrozen);
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
