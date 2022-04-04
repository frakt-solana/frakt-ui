import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { getAllUserTokens } from 'solana-nft-metadata';
import { keyBy } from 'lodash';

import { RawUserTokensByMint, UserNFT } from '.';
import { getArweaveMetadataByMint } from '../../utils/getArweaveMetadata';

export const useLazyTokens = (): {
  nfts: UserNFT[];
  fetchUserTokens: () => Promise<void>;
  loading: boolean;
  removeTokenOptimistic: (mints: string[]) => void;
} => {
  const [rawUserTokensByMint, setRawUserTokensByMint] =
    useState<RawUserTokensByMint>({});
  const [nfts, setNfts] = useState<UserNFT[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
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

  const removeTokenOptimistic = (mints: string[]): void => {
    const patchedRawUserTokensByMint = Object.fromEntries(
      Object.entries(rawUserTokensByMint).filter(
        ([key]) => !mints.includes(key),
      ),
    );

    const patchedNfts = nfts.filter((nft) => {
      return !mints.includes(nft.mint);
    });

    setNfts(patchedNfts);
    setRawUserTokensByMint(patchedRawUserTokensByMint);
  };

  return {
    nfts,
    fetchUserTokens: fetch,
    loading,
    removeTokenOptimistic,
  };
};
