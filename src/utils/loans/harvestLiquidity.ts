import { harvestLiquidity as txn } from '@frakters/nft-lending-v2';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';

import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';

type HarvestLiquidity = (props: {
  connection: Connection;
  wallet: WalletContextState;
  liquidityPool: string;
}) => Promise<boolean>;

export const harvestLiquidity: HarvestLiquidity = async ({
  connection,
  wallet,
  liquidityPool,
}): Promise<boolean> => {
  try {
    const options = Provider.defaultOptions();
    const provider = new Provider(connection, wallet, options);

    await txn({
      programId: new PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      provider,
      liquidityPool: new PublicKey(liquidityPool),
      user: wallet.publicKey,
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
      message: 'Harvest liquidity successfully!',
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

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
