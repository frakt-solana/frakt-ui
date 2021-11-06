import React, { useContext, useEffect, useState } from 'react';
import BN from 'bn.js';
import { getAllUserTokens, TokenView } from 'solana-nft-metadata';

import { useConnection } from '../../external/contexts/connection';
import { useWallet } from '../../external/contexts/wallet';
import {
  TokensByMint,
  UseFrktBalanceInterface,
  UserToken,
  UserTokensInterface,
  UseUserTokensInterface,
} from './userTokens.model';
import config from '../../config';
import { getArweaveMetadata } from '../../utils/getArweaveMetadata';

const UserTokensContext = React.createContext<UserTokensInterface>({
  tokens: [],
  tokensByMint: {},
  loading: false,
  frktBalance: new BN(0),
  updateFrktBalance: () => {},
});

export const UserTokensProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { wallet, connected } = useWallet();
  const connection = useConnection();
  const [frktBalance, setFrktBalance] = useState<BN>(new BN(0));
  const [tokens, setTokens] = useState<UserToken[]>([]);
  const [tokensByMint, setTokensByMint] = useState<TokensByMint>({});
  const [loading, setLoading] = useState<boolean>(false);

  const clearTokens = () => {
    setTokens([]);
    setTokensByMint({});
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

      const mints = userTokens.map(({ mint }) => String(mint));
      const arweaveMetadata = await getArweaveMetadata(mints);

      const tokens = arweaveMetadata.map(({ mint, metadata }) => ({
        mint,
        metadata,
      }));

      const tokensWithMetadata: TokensByMint = tokens.reduce(
        (acc: TokensByMint, { mint, metadata }): TokensByMint => {
          acc[mint] = metadata;
          return acc;
        },
        {},
      );

      setTokensByMint(tokensWithMetadata);
      setTokens(tokens as UserToken[]);
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
      value={{ tokens, tokensByMint, loading, frktBalance, updateFrktBalance }}
    >
      {children}
    </UserTokensContext.Provider>
  );
};

export const useUserTokens = (): UseUserTokensInterface => {
  const { tokens, tokensByMint, loading } = useContext(UserTokensContext);
  return {
    tokens,
    tokensByMint,
    loading,
  };
};

export const useFrktBalance = (): UseFrktBalanceInterface => {
  const { frktBalance, updateFrktBalance } = useContext(UserTokensContext);
  return {
    balance: frktBalance,
    updateBalance: updateFrktBalance,
  };
};
