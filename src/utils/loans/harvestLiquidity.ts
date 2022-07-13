import { web3, loans } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import { captureSentryError } from '../sentry';
import {
  signAndConfirmTransaction,
  showSolscanLinkNotification,
} from '../transactions';

type HarvestLiquidity = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  liquidityPool: string;
}) => Promise<boolean>;

export const harvestLiquidity: HarvestLiquidity = async ({
  connection,
  wallet,
  liquidityPool,
}): Promise<boolean> => {
  try {
    await loans.harvestLiquidity({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      adminPubkey: new web3.PublicKey(process.env.LOANS_FEE_ADMIN_PUBKEY),
      connection,
      liquidityPool: new web3.PublicKey(liquidityPool),
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

    captureSentryError({
      error,
      wallet,
      transactionName: 'harvestLiquidity',
      params: { liquidityPool },
    });

    return false;
  }
};
