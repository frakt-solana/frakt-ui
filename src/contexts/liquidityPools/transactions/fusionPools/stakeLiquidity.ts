import { Router, stakeInFusion } from '@frakters/fusion-pool';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';

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
      async (txn) => {
        const { blockhash } = await connection.getRecentBlockhash();
        txn.recentBlockhash = blockhash;
        txn.feePayer = walletPublicKey;
        const signed = await signTransaction(txn);
        const txid = await connection.sendRawTransaction(signed.serialize());
        return void connection.confirmTransaction(txid);
      },
    );
  };
