import { raydium, web3 } from '@frakt-protocol/frakt-sdk';

import { LiquidityPoolKeysV4String } from './raydiumLiquidityPools.model';

export const convertStringLiquidityPoolKeysV4ToPublicKeys = (
  rawPoolKeysV4: LiquidityPoolKeysV4String,
): raydium.LiquidityPoolKeysV4 => {
  return {
    authority: new web3.PublicKey(rawPoolKeysV4.authority),
    baseMint: new web3.PublicKey(rawPoolKeysV4.baseMint),
    baseVault: new web3.PublicKey(rawPoolKeysV4.baseVault),
    id: new web3.PublicKey(rawPoolKeysV4.id),
    lpMint: new web3.PublicKey(rawPoolKeysV4.lpMint),
    lpVault: new web3.PublicKey(rawPoolKeysV4.lpVault),
    marketAsks: new web3.PublicKey(rawPoolKeysV4.marketAsks),
    marketAuthority: new web3.PublicKey(rawPoolKeysV4.marketAuthority),
    marketBaseVault: new web3.PublicKey(rawPoolKeysV4.marketBaseVault),
    marketBids: new web3.PublicKey(rawPoolKeysV4.marketBids),
    marketEventQueue: new web3.PublicKey(rawPoolKeysV4.marketEventQueue),
    marketId: new web3.PublicKey(rawPoolKeysV4.marketId),
    marketProgramId: new web3.PublicKey(rawPoolKeysV4.marketProgramId),
    marketQuoteVault: new web3.PublicKey(rawPoolKeysV4.marketQuoteVault),
    marketVersion: rawPoolKeysV4.marketVersion,
    openOrders: new web3.PublicKey(rawPoolKeysV4.openOrders),
    programId: new web3.PublicKey(rawPoolKeysV4.programId),
    quoteMint: new web3.PublicKey(rawPoolKeysV4.quoteMint),
    quoteVault: new web3.PublicKey(rawPoolKeysV4.quoteVault),
    targetOrders: new web3.PublicKey(rawPoolKeysV4.targetOrders),
    version: rawPoolKeysV4.version,
    withdrawQueue: new web3.PublicKey(rawPoolKeysV4.withdrawQueue),
  };
};
