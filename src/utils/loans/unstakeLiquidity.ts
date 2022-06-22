import { unstakeLiquidity as txn } from '@frakters/nft-lending-v2';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';

import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import { captureSentryError } from '../sentry';
import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../transactions';

type UnstakeLiquidity = (props: {
  connection: Connection;
  wallet: WalletContextState;
  liquidityPool: string;
  amount: number;
}) => Promise<boolean>;

export const unstakeLiquidity: UnstakeLiquidity = async ({
  connection,
  wallet,
  liquidityPool,
  amount,
}): Promise<boolean> => {
  try {
    const options = Provider.defaultOptions();
    const provider = new Provider(connection, wallet, options);

    await txn({
      programId: new PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      provider,
      liquidityPool: new PublicKey(liquidityPool),
      user: wallet.publicKey,
      amount,
      admin: new PublicKey(process.env.LOANS_ADMIN_PUBKEY),
      sendTxn: async (transaction) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          wallet,
          commitment: 'finalized',
        });
      },
    });

    notify({
      message: 'Unstake liquidity successfully!',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'The transaction just failed :( Give it another try',
        type: NotifyType.ERROR,
      });
    }

    captureSentryError({ error, wallet, transactionName: 'unstakeLiquidity' });

    return false;
  }
};
