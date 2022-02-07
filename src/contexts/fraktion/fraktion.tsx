import { PublicKey } from '@solana/web3.js';
import {
  initBacket as initVaultTransaction,
  addNFTsToBacket as addNFTsToVaultTransaction,
  finishBacket as finishVaultTransaction,
} from 'fraktionalizer-client-library';
import { MARKETS } from '@project-serum/serum';
import { WSOL } from '@raydium-io/raydium-sdk';
import BN from 'bn.js';

import {
  AddNFTsToVault,
  CreateMarket,
  CreateVault,
  FinishVault,
  GetVaults,
  InitVault,
  Vault,
  VaultData,
} from './fraktion.model';
import fraktionConfig from './config';
import { IS_DEVNET } from '../../config';
import { registerToken } from '../../utils/registerToken';
import { adjustPricePerFraction } from './utils';
import { notify, useBFF } from '../../utils';
import { listMarket } from '../../utils/serumUtils/send';
import { registerMarket } from '../../utils/markets';
import { VAULTS_AND_META_CACHE_URL } from './fraktion.constants';
import API from '../../utils/cacher';
import {
  getVaultState,
  mapAuctionsByVaultPubkey,
  mapBidsByAuctionPubkey,
  mapMarketExistenceByFractionMint,
  mapMetadataByNftMint,
  mapSafetyBoxesByVaultPubkey,
  parseVaults,
  transformToSafetyBoxesWithMetadata,
} from './fraktion.helpers';

const { PROGRAM_PUBKEY, SOL_TOKEN_PUBKEY, FRACTION_DECIMALS, ADMIN_PUBKEY } =
  fraktionConfig;

export const getVaultsFromOldCacher: GetVaults = async (markets) => {
  const { allVaults, metas } = await (
    await fetch(VAULTS_AND_META_CACHE_URL)
  ).json();

  const marketExistenceByFractionMint =
    mapMarketExistenceByFractionMint(markets);

  const vaults = parseVaults(allVaults?.vaults);
  const safetyBoxesByVaultPubkey = mapSafetyBoxesByVaultPubkey(
    allVaults?.safetyBoxes,
  );
  const auctionByVaultPubkey = mapAuctionsByVaultPubkey(allVaults?.auctions);
  const bidsByAuctionPubkey = mapBidsByAuctionPubkey(allVaults?.bids);
  const metadataByNftMint = mapMetadataByNftMint(metas);

  const vaultsData = vaults.map((vault: Vault): VaultData => {
    const { vaultPubkey, fractionMint } = vault;
    const relatedSafetyBoxes = safetyBoxesByVaultPubkey[vaultPubkey] || [];
    const relatedAuction = auctionByVaultPubkey[vaultPubkey] || null;
    const relatedBids =
      bidsByAuctionPubkey[relatedAuction?.auctionPubkey] || [];

    const relatedSafetyBoxesWithMetadata = transformToSafetyBoxesWithMetadata(
      relatedSafetyBoxes,
      metadataByNftMint,
    );

    //? Vault verified only if all nfts are verified
    const isVaultVerified = relatedSafetyBoxesWithMetadata.every(
      ({ isNftVerified }) => isNftVerified,
    );

    return {
      ...vault,
      //? set state of auction for frontend requirements (more info in getVaultRealState description)
      state: getVaultState(vault.state, relatedAuction),
      realState: vault.state,
      isVerified: isVaultVerified,
      hasMarket: marketExistenceByFractionMint[fractionMint] || false,
      safetyBoxes: relatedSafetyBoxesWithMetadata,
      auction: {
        auction: relatedAuction,
        bids: relatedBids,
      },
    };
  });

  return vaultsData;
};

export const getVaultsFromBff: GetVaults = () => {
  return API.getVaults();
};

export const getVaults = useBFF() ? getVaultsFromBff : getVaultsFromOldCacher;

export const createMarket: CreateMarket = async (
  fractionsMint,
  tickerName,
  walletPublicKey,
  signAllTransactions,
  connection,
) => {
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
      baseMint: new PublicKey(fractionsMint),
      quoteMint: new PublicKey(WSOL.mint),
      baseLotSize: BASE_LOT_SIZE,
      quoteLotSize: QUOTE_LOT_SIZE,
      dexProgramId,
    });
    await registerMarket(tickerName, marketAddress.toBase58(), fractionsMint);
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

export const createVault: CreateVault = async ({
  userNfts = [],
  pricePerFraction,
  fractionsAmount,
  walletPublicKey,
  signTransaction,
  connection,
  unfinishedVaultData,
  tokenData,
  rawUserTokensByMint,
}) => {
  try {
    //? If vault doesn't exist then init vault
    const { vaultPubkey, fractionalMint, fractionTreasury, redeemTreasury } =
      !unfinishedVaultData
        ? await initVault(walletPublicKey, signTransaction, connection)
        : unfinishedVaultData;

    if (userNfts.length) {
      await addNFTsToVault(
        vaultPubkey,
        userNfts,
        walletPublicKey,
        signTransaction,
        connection,
        rawUserTokensByMint,
      );
    }

    await finishVault(
      { vaultPubkey, fractionalMint, fractionTreasury, redeemTreasury },
      pricePerFraction,
      fractionsAmount,
      walletPublicKey,
      signTransaction,
      connection,
    );

    //? Register token in our registry if it's mainnet
    if (!IS_DEVNET) {
      const { name, tickerName, imageUrl } = tokenData;
      registerToken(tickerName, fractionalMint, imageUrl, name, vaultPubkey);
    }

    notify({
      message: 'Fraktionalized successfully',
      type: 'success',
    });

    return fractionalMint;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    notify({
      message: 'Transaction failed',
      type: 'error',
    });
    return null;
  }
};

const initVault: InitVault = async (
  walletPublicKey,
  signTransaction,
  connection,
) => {
  const {
    vault: vaultPubkey,
    fractionalMint,
    fractionTreasury,
    redeemTreasury,
  } = await initVaultTransaction({
    connection,
    fractionDecimals: FRACTION_DECIMALS,
    priceMint: SOL_TOKEN_PUBKEY,
    userPubkey: walletPublicKey.toBase58(),
    vaultProgramId: PROGRAM_PUBKEY,
    sendTxn: async (txn, signers) => {
      const { blockhash } = await connection?.getRecentBlockhash();
      txn.recentBlockhash = blockhash;
      txn.feePayer = walletPublicKey;
      txn.sign(...signers);
      const signed = await signTransaction(txn);
      const txid = await connection.sendRawTransaction(signed.serialize());
      return void connection.confirmTransaction(txid);
    },
  });

  return { vaultPubkey, fractionalMint, fractionTreasury, redeemTreasury };
};

const addNFTsToVault: AddNFTsToVault = async (
  vaultPubkey,
  userNfts,
  walletPublicKey,
  signTransaction,
  connection,
  rawUserTokensByMint,
) => {
  const nftMintsAndTokenAccounts = userNfts.map(({ mint }) => ({
    mintAddress: mint,
    tokenAccount: String(rawUserTokensByMint[mint]?.tokenAccountPubkey),
  }));

  await addNFTsToVaultTransaction({
    connection,
    nftMintsAndTokenAccounts,
    vaultProgramId: PROGRAM_PUBKEY,
    userPubkey: walletPublicKey.toString(),
    vaultStrPubkey: vaultPubkey,
    sendTxn: async (txn, signers) => {
      const { blockhash } = await connection?.getRecentBlockhash();
      txn.recentBlockhash = blockhash;
      txn.feePayer = walletPublicKey;
      txn.sign(...signers);
      const signed = await signTransaction(txn);
      const txid = await connection.sendRawTransaction(signed.serialize());
      return void connection.confirmTransaction(txid);
    },
  });
};

const finishVault: FinishVault = async (
  unfinishedVaultData,
  pricePerFraction,
  fractionsAmount,
  walletPublicKey,
  signTransaction,
  connection,
) => {
  const { vaultPubkey, fractionalMint, fractionTreasury, redeemTreasury } =
    unfinishedVaultData;

  const fractionsAmountBn = new BN(fractionsAmount * 1e3);

  const pricePerFractionBn = adjustPricePerFraction(
    new BN(pricePerFraction * 1e6),
    fractionsAmountBn,
  );

  await finishVaultTransaction({
    connection,
    pricePerShare: pricePerFractionBn,
    numberOfShares: fractionsAmountBn,
    adminPubkey: ADMIN_PUBKEY,
    userPubkey: walletPublicKey.toString(),
    vault: vaultPubkey,
    fractionalMint: fractionalMint,
    fractionTreasury: fractionTreasury,
    redeemTreasury: redeemTreasury,
    vaultProgramId: PROGRAM_PUBKEY,
    sendTxn: async (txn) => {
      const { blockhash } = await connection.getRecentBlockhash();
      txn.recentBlockhash = blockhash;
      txn.feePayer = walletPublicKey;
      const signed = await signTransaction(txn);
      const txid = await connection.sendRawTransaction(signed.serialize());
      return void connection.confirmTransaction(txid);
    },
  });
};
