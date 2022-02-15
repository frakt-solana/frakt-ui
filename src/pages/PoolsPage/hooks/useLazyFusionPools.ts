import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnection } from '@solana/wallet-adapter-react';

import { FusionPoolInfo } from '../../../contexts/liquidityPools/liquidityPools.model';
import { fetchProgramAccounts } from '../../../contexts/liquidityPools/liquidityPools.helpers';
import { FUSION_PROGRAM_PUBKEY } from '../../../contexts/liquidityPools/transactions/fusionPools';

type FetchFusionPools = (lpMints: string[]) => Promise<void>;

export type FusionPoolInfoByMint = Map<string, FusionPoolInfo>;

export const useLazyFusionPools = (): {
  loading: boolean;
  fusionPoolInfoMap: FusionPoolInfoByMint;
  fetchProgramAccountInfo: FetchFusionPools;
} => {
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(true);
  const [fusionPoolInfoMap, setFusionPoolInfoMap] =
    useState<FusionPoolInfoByMint>(new Map());

  const fetchProgramAccountInfo: FetchFusionPools = async (
    lpMints: string[],
  ) => {
    try {
      const allProgramAccounts = await fetchProgramAccounts({
        vaultProgramId: new PublicKey(FUSION_PROGRAM_PUBKEY),
        connection,
      });

      const fusionPoolInfoMap = [allProgramAccounts].reduce(
        (programAccountMap) => {
          const {
            secondaryRewards,
            stakeAccounts,
            mainRouters,
            secondaryStakeAccounts,
          } = allProgramAccounts;

          lpMints.map((lpMint) => {
            const router = mainRouters.find(
              ({ tokenMintOutput }) => tokenMintOutput === lpMint,
            );
            {
              programAccountMap.set(lpMint, {
                secondaryReward: secondaryRewards.filter(
                  ({ routerPubkey }) =>
                    routerPubkey === router.mainRouterPubkey,
                ),
                stakeAccount: stakeAccounts
                  .filter(
                    ({ routerPubkey }) =>
                      routerPubkey === router.mainRouterPubkey,
                  )
                  .find(({ isStaked }) => isStaked),
                mainRouter: mainRouters.find(
                  ({ mainRouterPubkey }) =>
                    mainRouterPubkey === router.mainRouterPubkey,
                ),
                secondaryStakeAccount: secondaryStakeAccounts[0],
              });
            }
          });
          console.log(programAccountMap);
          return programAccountMap;
        },
        new Map<string, FusionPoolInfo>(),
      );

      setFusionPoolInfoMap(fusionPoolInfoMap);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { fusionPoolInfoMap, loading, fetchProgramAccountInfo };
};
