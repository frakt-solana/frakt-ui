import {
  Connection,
  Keypair,
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  createFraktionalizer,
  closeFraktionalizer,
  redeemRewardsFromShares,
} from 'fraktionalizer-client-library';
import BN from 'bn.js';
import { ENV as ChainID } from '@solana/spl-token-registry';

import { WalletAdapter } from '../../external/contexts/wallet';
import { CreateFraktionalizerResult, VaultData } from './fraktion.model';
import fraktionConfig from './config';
import globalConfig from '../../config';
import { notify } from '../../external/utils/notifications';
import { RawUserTokensByMint, UserNFT } from '../userTokens/userTokens.model';
import { registerToken } from '../../utils/registerToken';
import { adjustPricePerFraction } from './utils';
import * as Sentry from '@sentry/react';

const { FRAKTION_PUBKEY, SOL_TOKEN_PUBKEY, FRACTION_DECIMALS, ADMIN_PUBKEY } =
  fraktionConfig;
const { ENDPOINT, FRKT_TOKEN_MINT_PUBLIC_KEY } = globalConfig;

export const fraktionalize = async (
  userNft: UserNFT,
  tickerName: string,
  pricePerFraction: number,
  fractionsAmount: number,
  token: 'SOL' | 'FRKT',
  wallet: WalletAdapter,
  connection: Connection,
): Promise<CreateFraktionalizerResult | null> => {
  try {
    const { mint, metadata } = userNft;

    const fractionsAmountBn = new BN(fractionsAmount * 1e3);

    const pricePerFractionBn = adjustPricePerFraction(
      new BN(pricePerFraction * 1e6),
      fractionsAmountBn,
    );

    const result = await createFraktionalizer(
      connection,
      pricePerFractionBn, //1e9 for SOL, 1e8 for FRKT and divide by 1e6 (fraction decimals)
      fractionsAmountBn,
      FRACTION_DECIMALS,
      mint,
      ADMIN_PUBKEY,
      token === 'SOL' ? SOL_TOKEN_PUBKEY : FRKT_TOKEN_MINT_PUBLIC_KEY,
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

    if (result && ENDPOINT.chainID === ChainID.MainnetBeta) {
      const { fractionalMint, vault: vaultPubkey } = result;

      registerToken(
        tickerName,
        fractionalMint,
        metadata.image,
        metadata.name,
        vaultPubkey,
      );
    }

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

    if (error?.code !== 4001) {
      Sentry.setContext('Failed Transaction', {
        name: 'fraktionalize',
        params: {
          userNft: JSON.stringify(userNft),
          tickerName,
          pricePerFraction,
          fractionsAmount,
          token,
          wallet: wallet.publicKey.toString(),
        },
        error: error.toString(),
      });
      Sentry.captureException(error);
    }

    return null;
  }
};

export const buyout = async (
  vault: VaultData,
  userTokensByMint: RawUserTokensByMint,
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
    authority,
    nftMint,
    fractionMint,
    priceTokenMint,
    fractionTreasury,
    redeemTreasury,
    safetyBoxPubkey,
    store,
  } = vault;

  try {
    const userFractionTokenView = userTokensByMint[fractionMint];

    const userFractionTokenAmount =
      userFractionTokenView?.amountBN || new BN(0);

    const result = await closeFraktionalizer(
      connection,
      supply.toNumber(),
      lockedPricePerFraction
        .mul(supply.sub(userFractionTokenAmount))
        .toNumber(),
      wallet.publicKey,
      ADMIN_PUBKEY,
      new PublicKey(authority),
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

    if (error?.code !== 4001) {
      Sentry.setContext('Failed Transaction', {
        name: 'buyout',
        params: {
          vault: JSON.stringify(vault),
          userTokensByMint: JSON.stringify(userTokensByMint),
          wallet: wallet.publicKey.toString(),
        },
        error: error.toString(),
      });
      Sentry.captureException(error);
    }

    return null;
  }
};

export const redeem = async (
  vault: VaultData,
  wallet: WalletAdapter,
  connection: Connection,
): Promise<{
  instructions: TransactionInstruction[];
  signers: Keypair[];
} | null> => {
  const { publicKey, fractionMint, priceTokenMint, redeemTreasury } = vault;

  try {
    const result = await redeemRewardsFromShares(
      connection,
      wallet.publicKey.toString(),
      publicKey,
      priceTokenMint,
      fractionMint,
      redeemTreasury,
      FRAKTION_PUBKEY,
      async (txn): Promise<void> => {
        const { blockhash } = await connection.getRecentBlockhash();
        txn.recentBlockhash = blockhash;
        txn.feePayer = wallet.publicKey;
        const signed = await wallet.signTransaction(txn);
        const txid = await connection.sendRawTransaction(signed.serialize());
        return void connection.confirmTransaction(txid);
      },
    );

    notify({
      message: 'Redeemed successfully',
      type: 'success',
    });

    return result;
  } catch (error) {
    notify({
      message: 'Transaction failed',
      type: 'error',
    });

    if (error?.code !== 4001) {
      Sentry.setContext('Failed Transaction', {
        name: 'redeem',
        params: {
          vault: JSON.stringify(vault),
          wallet: wallet.publicKey.toString(),
        },
        error: error.toString(),
      });
      Sentry.captureException(error);
    }

    return null;
  }
};
