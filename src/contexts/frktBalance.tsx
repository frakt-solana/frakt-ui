import React, { useState, useContext, useEffect } from 'react';
import { useWallet, WalletAdapter } from '../external/contexts/wallet';
import * as contract from 'frakt-client';
import { useConnection } from '../external/contexts/connection';
import { Connection } from '@solana/web3.js';
import config from '../config';

interface IFrktBalanceInterface {
  balance: number;
  updateBalance: () => void;
}

export const FrktBalanceContext = React.createContext<IFrktBalanceInterface>({
  balance: 0,
  updateBalance: () => {},
});

const getWalletBalance = async (
  wallet: WalletAdapter,
  connection: Connection,
): Promise<number> => {
  const tokens = await contract.getAllUserTokens(wallet.publicKey, {
    connection,
  });
  return (
    (tokens as any).find(
      ({ mint }) => mint === config.FRKT_TOKEN_MINT_PUBLIC_KEY,
    )?.amount || 0
  );
};

export const FrktBalanceProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const [balance, setBalance] = useState<number>();
  const { wallet, connected: isWalletConnected } = useWallet();
  const connection = useConnection();

  useEffect(() => {
    isWalletConnected && updateBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWalletConnected, connection]);

  const updateBalance = () => {
    if (isWalletConnected && connection)
      getWalletBalance(wallet, connection).then(setBalance);
  };

  return (
    <FrktBalanceContext.Provider
      value={{
        balance,
        updateBalance,
      }}
    >
      {children}
    </FrktBalanceContext.Provider>
  );
};

export const useFrktBalance = (): IFrktBalanceInterface => {
  const { balance, updateBalance } = useContext(FrktBalanceContext);
  return {
    balance,
    updateBalance,
  };
};
