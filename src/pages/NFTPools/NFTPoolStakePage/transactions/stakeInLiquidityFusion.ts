import { BN, Provider } from '@project-serum/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { pools } from '@frakt-protocol/frakt-sdk';

import { FusionPool } from '../../../../contexts/liquidityPools';
import { notify } from '../../../../utils';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';

type StakeInLiquidityFusion = (props: {
  amount: BN;
  connection: Connection;
  wallet: WalletContextState;
  liquidityFusionPool: FusionPool;
}) => Promise<boolean>;

export const stakeInLiquidityFusion: StakeInLiquidityFusion = async ({
  amount,
  connection,
  wallet,
  liquidityFusionPool,
}): Promise<boolean> => {
  try {
    const stakeTransaction = new Transaction();

    const stakeInstruction = await pools.stakeInFusion(
      new PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      new Provider(connection, wallet, null),
      wallet.publicKey,
      new PublicKey(liquidityFusionPool?.router.tokenMintInput),
      new PublicKey(liquidityFusionPool?.router.tokenMintOutput),
      amount,
    );

    stakeTransaction.add(stakeInstruction);

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    stakeTransaction.recentBlockhash = blockhash;
    stakeTransaction.feePayer = wallet.publicKey;

    const signedTransaction = await wallet.signTransaction(stakeTransaction);

    const txid = await connection.sendRawTransaction(
      signedTransaction.serialize(),
      // { skipPreflight: true },
    );

    notify({
      message: 'Transactions sent',
      type: NotifyType.INFO,
    });

    await connection.confirmTransaction(
      { signature: txid, lastValidBlockHeight, blockhash },
      'finalized',
    );

    notify({
      message: 'Staked successfully',
      type: NotifyType.SUCCESS,
    });

    return true;
  } catch (error) {
    const isNotConfirmed = showSolscanLinkNotification(error);

    if (!isNotConfirmed) {
      notify({
        message: 'Stake failed',
        type: NotifyType.ERROR,
      });
    }

    // eslint-disable-next-line no-console
    console.error(error);

    return false;
  }
};
