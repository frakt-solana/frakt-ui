import { harvestInFusion, Router, Stake } from '@frakters/fusion-pool';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

import { notify } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { signAndConfirmTransaction } from '../../../../utils/transactions';
import { FUSION_PROGRAM_PUBKEY } from './constants';

export const harvestLiquidity =
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
    try {
      await harvestInFusion(
        walletPublicKey,
        connection,
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

      notify({
        message: 'Liquidity harvest successfully',
        type: NotifyType.SUCCESS,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
      });
    }
  };
