import { IS_DEVNET } from '../../config';

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

const meStrategy = async (
  mintPubkey: string,
): Promise<VerificationStrategyResult> => {
  try {
    const result = await (
      await fetch(
        `https://api-mainnet.magiceden.io/rpc/getNFTByMintAddress/${mintPubkey}`,
      )
    ).json();

    if (result?.results?.collectionTitle) {
      return { success: true, collection: result.results.collectionTitle };
    }

    return { error: true };
  } catch (error) {
    return { error: true };
  }
};

const solseaStrategy = async (
  mintPubkey: string,
): Promise<VerificationStrategyResult> => {
  try {
    const result = await (
      await fetch(`https://api.all.art/v1/solana/${mintPubkey}`)
    ).json();

    if (result?.verified) {
      return { success: true, collection: result.nft_collection.title };
    }

    return { error: true };
  } catch (error) {
    return { error: true };
  }
};

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

const githubStrategy = async (mintPubkey: string) => {
  //raw.githubusercontent.com/frakt-solana/verified-mints/main/mints.json

  try {
    const result = await (
      await fetch(
        `https://raw.githubusercontent.com/frakt-solana/verified-mints/main/mints.json`,
      )
    ).json();

    const collectionMint = result.find(({ mint }) => mint === mintPubkey);
    if (collectionMint) {
      return { success: true, collection: collectionMint.collection };
    }

    return { error: true };
  } catch (error) {
    return { error: true };
  }
};

const strategies = [
  exchangeStrategy,
  deStrategy,
  meStrategy,
  solseaStrategy,
  githubStrategy,
];

const verifyMint = async (
  mintPubkey: string,
): Promise<VerificationStrategyResult> => {
  // * devnet check to prevent ddos
  if (IS_DEVNET)
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
