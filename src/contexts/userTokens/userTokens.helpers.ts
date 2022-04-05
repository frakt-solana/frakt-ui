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
): Promise<UserNFT[]> => {
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

  const userNFTs: UserNFT[] = data?.result?.assets
    ?.filter(({ chain, network }) => {
      return chain === 'SOL' && network === 'mainnet beta';
    })
    .map((nft) => {
      const {
        collectionName,
        creators,
        description,
        imageUrl,
        name,
        traits,
        tokenAddress,
      } = nft;

      const parsedCreators: NFTCreator[] = creators.map((address) => ({
        address,
        share: 0,
      }));

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
};

export const fetchWalletNFTsUsingArweave = async (
  rawUserTokensByMint: RawUserTokensByMint,
): Promise<UserNFT[]> => {
  const mints = Object.entries(rawUserTokensByMint)
    .filter(([, tokenView]) => tokenView.amount === 1)
    .map(([mint]) => mint);

  const arweaveMetadata = await getArweaveMetadataByMint(mints);

  const userNFTs = Object.entries(arweaveMetadata).map(([mint, metadata]) => ({
    mint,
    metadata,
  }));

  return userNFTs;
};
