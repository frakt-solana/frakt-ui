import { AccountInfo } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { useConnection } from '../../../hooks';

export const useNativeAccount = (): {
  account: AccountInfo<Buffer>;
} => {
  const connection = useConnection();
  const { wallet, publicKey } = useWallet();

  const [nativeAccount, setNativeAccount] = useState<AccountInfo<Buffer>>();

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.getAccountInfo(publicKey).then((acc) => {
      if (acc) {
        setNativeAccount(acc);
      }
    });
    connection.onAccountChange(publicKey, (acc) => {
      if (acc) {
        setNativeAccount(acc);
      }
    });
  }, [wallet, publicKey, connection]);

  return { account: nativeAccount };
};
