import { Connection, Keypair, TransactionInstruction } from '@solana/web3.js';
import {
  createFraktionalizer,
  closeFraktionalizer,
} from 'fraktionalizer-client-library';
import BN from 'bn.js';

import { WalletAdapter } from '../../external/contexts/wallet';
import { CreateFraktionalizerResult, VaultData } from './fraktion.model';
import fraktionConfig from './config';
import globalConfig from '../../config';
import { notify } from '../../external/utils/notifications';

const { FRAKTION_PUBKEY, SOL_TOKEN_PUBKEY, FRACTION_DECIMALS } = fraktionConfig;

export const fraktionalize = async (
  tokenMint: string,
  pricePerFraction: number,
  fractionsAmount: number,
  token: 'SOL' | 'FRKT',
  wallet: WalletAdapter,
  connection: Connection,
): Promise<CreateFraktionalizerResult | null> => {
  try {
    const result = await createFraktionalizer(
      connection,
      new BN(pricePerFraction * 1e6), //1e9 for SOL, 1e8 for FRKT and divide by 1e6 (fraction decimals)
      new BN(fractionsAmount).mul(new BN(1e3)),
      FRACTION_DECIMALS,
      tokenMint,
      fraktionConfig.ADMIN_PUBKEY,
      token === 'SOL'
        ? SOL_TOKEN_PUBKEY
        : globalConfig.FRKT_TOKEN_MINT_PUBLIC_KEY,
      wallet.publicKey.toString(),
      FRAKTION_PUBKEY,
      async (txn, signers): Promise<void> => {
        const { blockhash } = await connection.getRecentBlockhash();
        txn.recentBlockhash = blockhash;
        txn.feePayer = wallet.publicKey;
        txn.sign(...signers);
        const signed = await wallet.signTransaction(txn);
        const txid = await connection.sendRawTransaction(signed.serialize());
        return void connection.confirmTransaction(txid);
      },
    );

    notify({
      message: 'Fraktionalized successfully',
      type: 'success',
    });

    return result;
  } catch (error) {
    notify({
      message: 'Transaction failed',
      type: 'error',
    });
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};

export const buyout = async (
  vault: VaultData,
  wallet: WalletAdapter,
  connection: Connection,
): Promise<{
  instructions: TransactionInstruction[];
  signers: Keypair[];
} | null> => {
  const {
    supply,
    lockedPricePerFraction,
    publicKey,
    nftMint,
    fractionMint,
    priceTokenMint,
    fractionTreasury,
    redeemTreasury,
    safetyBoxPubkey,
    store,
  } = vault;

  try {
    const result = await closeFraktionalizer(
      connection,
      supply.toNumber(),
      lockedPricePerFraction.toNumber(),
      wallet.publicKey,
      publicKey,
      safetyBoxPubkey,
      nftMint,
      store,
      fractionMint,
      fractionTreasury,
      redeemTreasury,
      priceTokenMint,
      FRAKTION_PUBKEY,
      async (txn, signers): Promise<void> => {
        const { blockhash } = await connection.getRecentBlockhash();
        txn.recentBlockhash = blockhash;
        txn.feePayer = wallet.publicKey;
        txn.sign(...signers);
        const signed = await wallet.signTransaction(txn);
        const txid = await connection.sendRawTransaction(signed.serialize());
        return void connection.confirmTransaction(txid);
      },
    );

    notify({
      message: 'Buyout passed successfully',
      type: 'success',
    });

    return result;
  } catch (error) {
    notify({
      message: 'Transaction failed',
      type: 'error',
    });
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};
