import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  createFraktionalizer,
  closeFraktionalizer,
  redeemRewardsFromShares,
} from 'fraktionalizer-client-library';
import BN from 'bn.js';

import { CreateFraktionalizerResult, VaultData } from './fraktion.model';
import fraktionConfig from './config';
import { IS_DEVNET, FRKT_TOKEN_MINT_PUBLIC_KEY } from '../../config';
import { RawUserTokensByMint, UserNFT } from '../userTokens';
import { registerToken } from '../../utils/registerToken';
import { adjustPricePerFraction } from './utils';
import { notify } from '../../utils';
import { listMarket } from '../../utils/serumUtils/send';
import { MARKETS } from '@project-serum/serum';
import { WSOL } from '@raydium-io/raydium-sdk';
import { registerMarket } from '../../utils/markets';

const { FRAKTION_PUBKEY, SOL_TOKEN_PUBKEY, FRACTION_DECIMALS, ADMIN_PUBKEY } =
  fraktionConfig;

export const fraktionalize = async (
  userNft: UserNFT,
  tickerName: string,
  pricePerFraction: number,
  fractionsAmount: number,
  token: 'SOL' | 'FRKT',
  walletPublicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
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
      walletPublicKey.toString(),
      FRAKTION_PUBKEY,
      async (txn, signers): Promise<void> => {
        const { blockhash } = await connection.getRecentBlockhash();
        txn.recentBlockhash = blockhash;
        txn.feePayer = walletPublicKey;
        txn.sign(...signers);
        const signed = await signTransaction(txn);
        const txid = await connection.sendRawTransaction(signed.serialize());
        return void connection.confirmTransaction(txid);
      },
    );

    if (result && !IS_DEVNET) {
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
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};

export const buyout = async (
  vault: VaultData,
  userTokensByMint: RawUserTokensByMint,
  walletPublicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
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
      walletPublicKey,
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
        txn.feePayer = walletPublicKey;
        txn.sign(...signers);
        const signed = await signTransaction(txn);
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

export const redeem = async (
  vault: VaultData,
  walletPublicKey: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  connection: Connection,
): Promise<{
  instructions: TransactionInstruction[];
  signers: Keypair[];
} | null> => {
  const { publicKey, fractionMint, priceTokenMint, redeemTreasury } = vault;

  try {
    const result = await redeemRewardsFromShares(
      connection,
      walletPublicKey.toString(),
      publicKey,
      priceTokenMint,
      fractionMint,
      redeemTreasury,
      FRAKTION_PUBKEY,
      async (txn): Promise<void> => {
        const { blockhash } = await connection.getRecentBlockhash();
        txn.recentBlockhash = blockhash;
        txn.feePayer = walletPublicKey;
        const signed = await signTransaction(txn);
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
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
};

export const createFraktionsMarket = async (
  fractionsMintAddress: string,
  tickerName: string,
  walletPublicKey: PublicKey,
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>,
  connection: Connection,
): Promise<boolean> => {
  const dexProgramId = MARKETS.find(({ deprecated }) => !deprecated).programId;
  const LOT_SIZE = 0.1;
  const TICK_SIZE = 0.00001;
  const BASE_TOKE_DECIMALS = 3; // FRAKTION DECIMALS
  const QUOTE_TOKEN_DECIMALS = WSOL.decimals; // SOL DECIMALS
  const BASE_LOT_SIZE = Math.round(10 ** BASE_TOKE_DECIMALS * LOT_SIZE);
  const QUOTE_LOT_SIZE = Math.round(
    LOT_SIZE * 10 ** QUOTE_TOKEN_DECIMALS * TICK_SIZE,
  );

  try {
    const marketAddress = await listMarket({
      connection,
      walletPublicKey,
      signAllTransactions,
      baseMint: new PublicKey(fractionsMintAddress),
      quoteMint: new PublicKey(WSOL.mint),
      baseLotSize: BASE_LOT_SIZE,
      quoteLotSize: QUOTE_LOT_SIZE,
      dexProgramId,
    });
    await registerMarket(
      tickerName,
      marketAddress.toBase58(),
      fractionsMintAddress,
    );
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    notify({
      message: 'Error listing new market',
      description: err.message,
      type: 'error',
    });
    return false;
  }
};
