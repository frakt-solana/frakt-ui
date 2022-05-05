import { PublicKey } from '@solana/web3.js';

import {
  getArweaveMetadataByMint,
  NFTCreator,
} from '../../utils/getArweaveMetadata';
import {
  QNFetchResponseData,
  UserNFT,
  RawUserTokensByMint,
} from './userTokens.model';

export const fetchWalletNFTsFromQuickNode = async (
  walletAddress: string,
): Promise<UserNFT[] | null> => {
  try {
    const data: QNFetchResponseData = await (
      await fetch(`${process.env.RPC_ENDPOINT}`, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'qn_fetchNFTs',
          params: [walletAddress, []],
        }),
      })
    ).json();

    const userNFTs: UserNFT[] = data?.result?.assets.map((nft) => {
      const {
        collectionName,
        creators,
        description,
        imageUrl,
        name,
        traits,
        tokenAddress,
      } = nft;

      const parsedCreators: NFTCreator[] = creators.map(
        ({ address, share, verified }) => ({
          address,
          share: share || 0,
          verified: !!verified,
        }),
      );

      return {
        mint: tokenAddress,
        metadata: {
          name,
          symbol: 'Unknown',
          description,
          collectionName,
          image: imageUrl,
          attributes: traits,
          properties: {
            creators: parsedCreators,
          },
        },
      };
    });

    return userNFTs;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return null;
  }
};

export const fetchWalletNFTsUsingArweave = async (
  rawUserTokensByMint: RawUserTokensByMint,
): Promise<UserNFT[] | null> => {
  try {
    const mints = Object.entries(rawUserTokensByMint)
      .filter(([, tokenView]) => tokenView.amount === 1)
      .map(([mint]) => mint);

    const arweaveMetadata = await getArweaveMetadataByMint(mints);

    const userNFTs = Object.entries(arweaveMetadata).map(
      ([mint, metadata]) => ({
        mint,
        metadata,
      }),
    );

    return userNFTs;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return null;
  }
};

type fetchNftsWithFallback = (props: {
  walletPublicKey: PublicKey;
  rawUserTokensByMint: RawUserTokensByMint;
}) => Promise<UserNFT[]>;

export const fetchNftsWithFallback: fetchNftsWithFallback = async ({
  walletPublicKey,
  rawUserTokensByMint,
}) => {
  const userNFTs = await fetchWalletNFTsFromQuickNode(
    walletPublicKey?.toBase58(),
  );

  if (!userNFTs) {
    return (await fetchWalletNFTsUsingArweave(rawUserTokensByMint)) || [];
  }

  return userNFTs || [];
};
