import { Connection, PublicKey } from '@solana/web3.js';
import { getAllProgramAccounts as getAllProgramAccountsRaw } from 'community-pools-client-library-v2';

import { PoolsState } from './nftPools.model';

export const getAllProgramAccounts = async ({
  connection,
}: {
  connection: Connection;
}): Promise<PoolsState> => {
  const res = await getAllProgramAccountsRaw(
    new PublicKey(process.env.REACT_APP_COMMUNITY_POOLS_PUBKEY),
    connection,
  );
  return res as any as PoolsState;
};
