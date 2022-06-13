import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Provider } from '@project-serum/anchor';
import { lending } from '@frakt-protocol/frakt-sdk';

import { NotifyType } from '../../../utils/solanaUtils';
import { notify } from '../../../utils';
import {
  showSolscanLinkNotification,
  signAndConfirmTransaction,
} from '../../../utils/transactions';

type DepositLiquidity = (props: {
  connection: Connection;
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
    const options = Provider.defaultOptions();
    const provider = new Provider(connection, wallet, options);

    await lending.depositLiquidity({
      programId: new PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      provider,
      liquidityPool: new PublicKey(liquidityPool),
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
