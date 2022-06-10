import { useWallet } from '@solana/wallet-adapter-react';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { useEffect, useRef, useState } from 'react';
import { utils, AccountInfoParsed } from '@frakt-protocol/frakt-sdk';

import { useConnection } from '../../../hooks';

type GetInfoAndSubscribe = (tokenMint: PublicKey) => Promise<void>;

type UseUserSplAccount = () => {
  accountInfo: AccountInfoParsed | null;
  loading: boolean;
  subscribe: GetInfoAndSubscribe;
  unsubscribe: () => void;
};

export const useUserSplAccount: UseUserSplAccount = () => {
  const connection = useConnection();
  const wallet = useWallet();

  const [loading, setLoading] = useState<boolean>(true);
  const [accountInfo, setAccountInfo] = useState<AccountInfoParsed>(null);
  const [tokenMint, setTokenMint] = useState<PublicKey>(null);

  const subscriptionId = useRef<number>();

  const setInfo = ({
    tokenAccountPubkey,
    tokenAccountEncoded,
  }: {
    tokenAccountPubkey: PublicKey;
    tokenAccountEncoded: AccountInfo<Buffer>;
  }) => {
    const parsedAccountInfo = utils.parseTokenAccount({
      tokenAccountPubkey,
      tokenAccountEncoded,
    });

    setAccountInfo(parsedAccountInfo);
  };

  const subscribe = (tokenAccountPubkey: PublicKey) => {
    if (tokenAccountPubkey === accountInfo?.pubkey) return;
    subscriptionId.current = connection.onAccountChange(
      tokenAccountPubkey,
      (tokenAccountEncoded) => {
        setInfo({ tokenAccountPubkey, tokenAccountEncoded });
      },
    );
  };

  const unsubscribe = () => {
    if (subscriptionId.current) {
      connection.removeAccountChangeListener(subscriptionId.current);
      subscriptionId.current = null;
    }
    setTokenMint(null);
  };

  const getInfoAndSubscribe: GetInfoAndSubscribe = async (tokenMint) => {
    try {
      setLoading(true);

      setTokenMint(tokenMint);

      const info = await utils.getTokenAccount({
        tokenMint,
        owner: wallet.publicKey,
        connection,
      });

      if (info) {
        setAccountInfo(info);
        subscribe(info.pubkey);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      setTokenMint(null);
      setAccountInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, wallet, tokenMint]);

  return {
    accountInfo,
    loading,
    subscribe: getInfoAndSubscribe,
    unsubscribe,
  };
};
