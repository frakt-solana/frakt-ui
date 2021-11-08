interface VerificationStrategyResult {
  error?: boolean;
  success?: boolean;
  collection?: string;
}

const deStrategy = async (
  mintPubkey: string,
): Promise<VerificationStrategyResult> => {
  try {
    const result = await (
      await fetch(
        `https://us-central1-digitaleyes-prod.cloudfunctions.net/collection-retriever?mint=${mintPubkey}`,
      )
    ).json();

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

const exchangeStrategy = async (
  mintPubkey: string,
): Promise<VerificationStrategyResult> => {
  try {
    const result = await (
      await fetch(
        `https://api.exchange.art/v1/public/tokens/metadata?mints=${mintPubkey}`,
      )
    ).json();

    if (result?.[mintPubkey]) {
      return { success: true, collection: result[mintPubkey].collectionName };
    }

    return { error: true };
  } catch (error) {
    return { error: true };
  }
};

const strategies = [deStrategy, meStrategy, exchangeStrategy];

const verifyMint = async (
  mintPubkey: string,
): Promise<VerificationStrategyResult> => {
  // * devnet check to prevent ddos
  if (process.env.REACT_APP_NETWORK === 'devnet')
    return {
      success: true,
      collection: 'test collection',
    };

  let endResult = { error: true } as VerificationStrategyResult;
  for (const strategy of strategies) {
    const result = await strategy(mintPubkey);

    if (result.success) {
      endResult = result;
    }
  }

  return endResult;
};

export interface VerificationByMint {
  [mint: string]: VerificationStrategyResult;
}

export const verifyMints = async (
  nftMints: string[],
): Promise<VerificationByMint> => {
  const results = await Promise.allSettled(nftMints.map(verifyMint));
  return nftMints.reduce((acc, key, i) => ({ ...acc, [key]: results[i] }), {});
};

export default verifyMints;
