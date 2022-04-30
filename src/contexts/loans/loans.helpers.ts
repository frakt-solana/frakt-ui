import {
  CollectionInfoView,
  getAllProgramAccounts,
} from '@frakters/nft-lending-v2';
import { Connection, PublicKey } from '@solana/web3.js';
import { groupBy } from 'lodash';

import { LoanData, LoanDataByPoolPublicKey } from './loans.model';

export const fetchLoanDataByPoolPublicKey = async (
  connection: Connection,
): Promise<LoanDataByPoolPublicKey> => {
  const { collectionInfos, deposits, liquidityPools, loans } =
    await getAllProgramAccounts(
      new PublicKey(process.env.LOANS_PROGRAM_PUBKEY),
      connection,
    );

  const collectionInfosByPoolPublicKey = groupBy(
    collectionInfos,
    'liquidityPool',
  );
  const depositsByPoolPublicKey = groupBy(deposits, 'liquidityPool');
  const loansByPoolPublicKey = groupBy(loans, 'liquidityPool');

  return liquidityPools?.reduce((loansData, liquidityPool) => {
    const { liquidityPoolPubkey } = liquidityPool;

    return loansData.set(liquidityPoolPubkey, {
      collectionsInfo:
        collectionInfosByPoolPublicKey[liquidityPoolPubkey] || [],
      deposits: depositsByPoolPublicKey[liquidityPoolPubkey] || [],
      liquidityPool: liquidityPool,
      loans: loansByPoolPublicKey[liquidityPoolPubkey] || [],
    });
  }, new Map<string, LoanData>());
};

export const getLoanCollectionInfo = (
  loanData: LoanData,
  collectionInfoPublicKey: string,
): CollectionInfoView => {
  return loanData.collectionsInfo?.find(
    ({ collectionInfoPubkey }) =>
      collectionInfoPubkey === collectionInfoPublicKey,
  );
};
