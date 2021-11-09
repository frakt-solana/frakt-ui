import { ENV as ChainID } from '@solana/spl-token-registry';

import config from '../../config';

const { ENDPOINT } = config;

interface VerificationStrategyResult {
  error?: boolean;
  success?: boolean;
  collection?: string;
}

const deStrategy = async (
  mintPubkey: string,
): Promise<VerificationStrategyResult> => {
  try {
    const result = JSON.parse(
      await (
        await fetch(
          `https://us-central1-digitaleyes-prod.cloudfunctions.net/collection-retriever?mint=${mintPubkey}`,
        )
      ).json(),
    );

    if (result?.name) {
      return { success: true, collection: result.name };
    }

    return { error: true };
  } catch (error) {
    return { error: true };
  }
};

// const meStrategy = async (
//   mintPubkey: string,
// ): Promise<VerificationStrategyResult> => {
//   try {
//     const result = await (
//       await fetch(
//         `https://api-mainnet.magiceden.io/rpc/getNFTByMintAddress/${mintPubkey}`,
//       )
//     ).json();

//     if (result?.results?.collectionTitle) {
//       return { success: true, collection: result.results.collectionTitle };
//     }

//     return { error: true };
//   } catch (error) {
//     return { error: true };
//   }
// };

const exchangeStrategy = async (
  mintPubkey: string,
): Promise<VerificationStrategyResult> => {
  try {
    const result = await (
      await fetch(
        `https://api.exchange.art/v1/public/tokens/metadata?mints=${mintPubkey}`,
      )
    ).json();

    if (result?.[mintPubkey]?.collectionName) {
      return { success: true, collection: result[mintPubkey].collectionName };
    }

    return { error: true };
  } catch (error) {
    return { error: true };
  }
};

const strategies = [exchangeStrategy, deStrategy];

const verifyMint = async (
  mintPubkey: string,
): Promise<VerificationStrategyResult> => {
  // * devnet check to prevent ddos
  if (ENDPOINT.chainID === ChainID.Devnet)
    return {
      success: true,
      collection: 'test collection',
    };

  let endResult = { error: true } as VerificationStrategyResult;
  for (const strategy of strategies) {
    const result = await strategy(mintPubkey);

    if (result.success) {
      endResult = result;
      return endResult;
    }
  }

  return endResult;
};

export interface VerificationByMint {
  [mint: string]: VerificationStrategyResult;
}

interface PromiseFulfilledResult<T> {
  status: 'fulfilled';
  value: T;
}

export const verifyMints = async (
  nftMints: string[],
): Promise<VerificationStrategyResult> => {
  const results = (await Promise.allSettled(nftMints.map(verifyMint))).map(
    (promise) => promise as PromiseFulfilledResult<VerificationStrategyResult>,
  );

  return nftMints.reduce(
    (acc, key, i) => ({ ...acc, [key]: results[i].value }),
    {},
  );
};

export default verifyMints;
