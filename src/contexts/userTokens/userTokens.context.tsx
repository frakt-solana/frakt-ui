import React, { useContext, useEffect, useState } from 'react';
import BN from 'bn.js';
import { getAllUserTokens, TokenView } from 'solana-nft-metadata';
import { keyBy } from 'lodash';

import { useConnection } from '../../external/contexts/connection';
import { useWallet } from '../../external/contexts/wallet';
import {
  nftsByMint,
  RawUserTokensByMint,
  UseFrktBalanceInterface,
  UserNFT,
  UserTokensInterface,
  UseUserTokensInterface,
} from './userTokens.model';
import config from '../../config';
import { getArweaveMetadataByMint } from '../../utils/getArweaveMetadata';

const UserTokensContext = React.createContext<UserTokensInterface>({
  nfts: [],
  nftsByMint: {},
  rawUserTokensByMint: {},
  loading: false,
  frktBalance: new BN(0),
  refetch: () => Promise.resolve(null),
});

export const UserTokensProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { wallet, connected } = useWallet();
  const connection = useConnection();
  const [frktBalance, setFrktBalance] = useState<BN>(new BN(0));
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
    setFrktBalance(new BN(0));
  };

  const updateFrktBalance = (userTokens: TokenView[]) => {
    if (connected && connection) {
      const token = (userTokens as any).find(
        ({ mint }) => mint === config.FRKT_TOKEN_MINT_PUBLIC_KEY,
      );
      if (token?.amount) {
        setFrktBalance(
          token.amount === -1 ? token.amountBN : new BN(Number(token.amount)),
        );
      } else {
        setFrktBalance(new BN(0));
      }
    }
  };

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const userTokens = await getAllUserTokens(wallet.publicKey, {
        connection,
      });
      updateFrktBalance(userTokens);

      const rawUserTokensByMint = keyBy(userTokens, 'mint');

      const mints = Object.keys(rawUserTokensByMint);
      const arweaveMetadata = await getArweaveMetadataByMint(mints);

      const tokensArray = Object.entries(arweaveMetadata).map(
        ([mint, metadata]) => ({
          mint,
          metadata,
        }),
      );

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
        frktBalance,
        refetch: fetchTokens,
      }}
    >
      {children}
    </UserTokensContext.Provider>
  );
};

export const useUserTokens = (): UseUserTokensInterface => {
  const { nfts, nftsByMint, rawUserTokensByMint, loading, refetch } =
    useContext(UserTokensContext);
  return {
    nfts,
    nftsByMint,
    rawUserTokensByMint,
    loading,
    refetch,
  };
};

export const useFrktBalance = (): UseFrktBalanceInterface => {
  const { frktBalance } = useContext(UserTokensContext);
  return {
    balance: frktBalance,
  };
};
