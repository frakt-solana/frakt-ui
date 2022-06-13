import { PublicKey } from '@solana/web3.js';
import { raydium } from '@frakt-protocol/frakt-sdk';

import { LiquidityPoolKeysV4String } from './raydiumLiquidityPools.model';

export const convertStringLiquidityPoolKeysV4ToPublicKeys = (
  rawPoolKeysV4: LiquidityPoolKeysV4String,
): raydium.LiquidityPoolKeysV4 => {
  return {
    authority: new PublicKey(rawPoolKeysV4.authority),
    baseMint: new PublicKey(rawPoolKeysV4.baseMint),
    baseVault: new PublicKey(rawPoolKeysV4.baseVault),
    id: new PublicKey(rawPoolKeysV4.id),
    lpMint: new PublicKey(rawPoolKeysV4.lpMint),
    lpVault: new PublicKey(rawPoolKeysV4.lpVault),
    marketAsks: new PublicKey(rawPoolKeysV4.marketAsks),
    marketAuthority: new PublicKey(rawPoolKeysV4.marketAuthority),
    marketBaseVault: new PublicKey(rawPoolKeysV4.marketBaseVault),
    marketBids: new PublicKey(rawPoolKeysV4.marketBids),
    marketEventQueue: new PublicKey(rawPoolKeysV4.marketEventQueue),
    marketId: new PublicKey(rawPoolKeysV4.marketId),
    marketProgramId: new PublicKey(rawPoolKeysV4.marketProgramId),
    marketQuoteVault: new PublicKey(rawPoolKeysV4.marketQuoteVault),
    marketVersion: rawPoolKeysV4.marketVersion,
    openOrders: new PublicKey(rawPoolKeysV4.openOrders),
    programId: new PublicKey(rawPoolKeysV4.programId),
    quoteMint: new PublicKey(rawPoolKeysV4.quoteMint),
    quoteVault: new PublicKey(rawPoolKeysV4.quoteVault),
    targetOrders: new PublicKey(rawPoolKeysV4.targetOrders),
    version: rawPoolKeysV4.version,
    withdrawQueue: new PublicKey(rawPoolKeysV4.withdrawQueue),
  };
};
