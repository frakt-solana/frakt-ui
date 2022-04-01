import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { getAllUserTokens } from 'solana-nft-metadata';
import { RawUserTokensByMint, UserNFT } from '.';
import { getArweaveMetadataByMint } from '../../utils/getArweaveMetadata';
import { keyBy } from 'lodash';

export const useLazyTokens = (): {
  nfts: UserNFT[];
  fetchPoolInfo: () => Promise<void>;
  loading: boolean;
} => {
  const [rawUserTokensByMint, setRawUserTokensByMint] =
    useState<RawUserTokensByMint>({});
  const [nfts, setNfts] = useState<UserNFT[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const fetch = async (): Promise<void> => {
    try {
      const userTokens = await getAllUserTokens(publicKey, {
        connection,
      });

      const rawUserTokensByMint = keyBy(userTokens, 'mint');

      setRawUserTokensByMint(rawUserTokensByMint);

      const mints = Object.entries(rawUserTokensByMint)
        .filter(([, tokenView]) => tokenView.amount === 1)
        .map(([mint]) => mint);

      const arweaveMetadata = await getArweaveMetadataByMint(mints);

      const tokensArray = Object.entries(arweaveMetadata).map(
        ([mint, metadata]) => ({
          mint,
          metadata,
        }),
      );

      setNfts(tokensArray);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    nfts,
    fetchPoolInfo: fetch,
    loading,
  };
};
