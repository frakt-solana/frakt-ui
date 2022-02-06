import { Router, Stake, unstakeInFusion } from '@frakters/fusion-pool';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

import { signAndConfirmTransaction } from '../../../../utils/transactions';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export const unstakeLiquidity =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({
    router,
    stakeAccount,
  }: {
    router: Router;
    stakeAccount: Stake;
  }): Promise<void> => {
    await unstakeInFusion(
      walletPublicKey,
      new PublicKey(FUSION_PROGRAM_PUBKEY),
      new PublicKey(router.token_mint_input),
      new PublicKey(router.token_mint_output),
      new PublicKey(router.routerPubkey),
      [new PublicKey(stakeAccount.stakePubkey)],
      new PublicKey(router.pool_config_input),
      new PublicKey(router.pool_config_output),
      async (transaction) => {
        await signAndConfirmTransaction({
          transaction,
          connection,
          walletPublicKey,
          signTransaction,
        });
      },
    );
  };
