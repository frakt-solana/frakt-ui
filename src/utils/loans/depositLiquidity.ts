import { WalletContextState } from '@solana/wallet-adapter-react';
import { lending, AnchorProvider, web3 } from '@frakt-protocol/frakt-sdk';

import { NotifyType } from '../solanaUtils';
import { notify } from '../';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../transactions';

type DepositLiquidity = (props: {
  connection: web3.Connection;
  wallet: WalletContextState;
  liquidityPool: string;
  amount: number;
}) => Promise<boolean>;

export const depositLiquidity: DepositLiquidity = async ({
  connection,
  wallet,
  liquidityPool,
  amount,
}): Promise<boolean> => {
  try {
    const options = AnchorProvider.defaultOptions();
    const provider = new AnchorProvider(connection, wallet, options);

    await lending.depositLiquidity({
      programId: new web3.PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      provider,
      liquidityPool: new web3.PublicKey(liquidityPool),
      user: wallet.publicKey,
      amount,
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
      message: 'Deposit liquidity successfully!',
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
