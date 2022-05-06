import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useIntercom } from 'react-use-intercom';

export const IntercomService: FC = () => {
  const { boot, update } = useIntercom();
  const wallet = useWallet();

  useEffect(() => {
    boot({
      alignment: 'left',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (wallet.connected) {
      return update({
        customAttributes: {
          ['Wallet Address']: wallet.publicKey.toBase58(),
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.connected]);

  return null;
};
