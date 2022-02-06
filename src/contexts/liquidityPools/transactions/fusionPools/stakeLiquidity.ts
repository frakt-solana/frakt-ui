import { Router, stakeInFusion } from '@frakters/fusion-pool';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';

import { signAndConfirmTransaction } from '../../../../utils/transactions';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export const stakeLiquidity =
  (
    connection: Connection,
    walletPublicKey: PublicKey,
    signTransaction: (transaction: Transaction) => Promise<Transaction>,
  ) =>
  async ({ amount, router }: { amount: BN; router: Router }): Promise<void> => {
    await stakeInFusion(
      walletPublicKey,
      connection,
      new PublicKey(FUSION_PROGRAM_PUBKEY),
      new PublicKey(router.token_mint_input),
      new PublicKey(router.token_mint_output),
      amount,
      new PublicKey(router.routerPubkey),
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
