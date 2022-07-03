import { Connection, PublicKey } from '@solana/web3.js';

import { TokenView } from '../../utils/accounts';
import {
  getArweaveMetadataByMint,
  NFTCreator,
} from '../../utils/getArweaveMetadata';
import {
  QNFetchResponseData,
  UserNFT,
  RawUserTokensByMint,
  QNFetchNFTData,
} from '../../state/userTokens/types';

const parseQuickNodeNFTs = (qnNftData: QNFetchNFTData[]): UserNFT[] => {
  const userNFTs: UserNFT[] = qnNftData.map((nft) => {
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
};

//TODO: Broken because of JWT autorization
const fetchAllWalletNftsQN = async (
  wallet: string,
  startPage = 1,
  previousNfts: UserNFT[] = [],
): Promise<UserNFT[]> => {
  const requestBody = {
    jsonrpc: '2.0',
    id: 1,
    method: 'qn_fetchNFTs',
    params: {
      wallet,
      page: startPage,
      perPage: 40,
    },
  };

  const { result }: QNFetchResponseData = await (
    await fetch(process.env.RPC_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })
  ).json();

  const nfts = parseQuickNodeNFTs(result?.assets || []);

  const userNFTs = [...previousNfts, ...nfts];

  if (nfts.length !== 0 && result.totalPages !== result.pageNumber) {
    return await fetchAllWalletNftsQN(wallet, startPage + 1, userNFTs);
  }

  return userNFTs;
};

export const fetchWalletNFTsFromQuickNode = async (
  walletAddress: string,
): Promise<UserNFT[] | null> => {
  try {
    const userNfts = await fetchAllWalletNftsQN(walletAddress);

    return userNfts || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return null;
  }
};

export const fetchWalletNFTsUsingArweave = async (
  rawUserTokensByMint: RawUserTokensByMint,
  connection: Connection,
): Promise<UserNFT[] | null> => {
  try {
    const mints = Object.entries(rawUserTokensByMint)
      .filter(([, tokenView]) => tokenView.amount === 1)
      .map(([mint]) => mint);

    const arweaveMetadata = await getArweaveMetadataByMint(mints, connection);

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
  connection: Connection;
}) => Promise<UserNFT[]>;

export const fetchNftsWithFallback: fetchNftsWithFallback = async ({
  walletPublicKey,
  rawUserTokensByMint,
  connection,
}) => {
  const userNFTs = await fetchWalletNFTsFromQuickNode(
    walletPublicKey?.toBase58(),
  );

  if (!userNFTs) {
    return (
      (await fetchWalletNFTsUsingArweave(rawUserTokensByMint, connection)) || []
    );
  }

  return userNFTs || [];
};

//? token.state === 2 for freezed accounts
export const isTokenFrozen = (token: TokenView): boolean => token.state === 2;
