import { web3, pools, AnchorProvider, BN } from '@frakt-protocol/frakt-sdk';
import { WalletContextState } from '@solana/wallet-adapter-react';

import { FusionPool } from '../../../../contexts/liquidityPools';
import { notify } from '../../../../utils';
import { captureSentryError } from '../../../../utils/sentry';
import { NotifyType } from '../../../../utils/solanaUtils';
import { showSolscanLinkNotification } from '../../../../utils/transactions';

type StakeInLiquidityFusion = (props: {
  amount: BN;
  connection: web3.Connection;
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
    const stakeTransaction = new web3.Transaction();

    const stakeInstruction = await pools.stakeInFusion(
      new web3.PublicKey(process.env.FUSION_PROGRAM_PUBKEY),
      new AnchorProvider(connection, wallet, null),
      wallet.publicKey,
      new web3.PublicKey(liquidityFusionPool?.router.tokenMintInput),
      new web3.PublicKey(liquidityFusionPool?.router.tokenMintOutput),
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

    captureSentryError({
      error,
      wallet,
      transactionName: 'stakeInLiquidityFusion',
    });

    return false;
  }
};
