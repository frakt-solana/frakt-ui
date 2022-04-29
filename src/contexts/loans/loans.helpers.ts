import { getAllProgramAccounts } from '@frakters/nft-lending-v2';
import { Connection, PublicKey } from '@solana/web3.js';
import { keyBy, groupBy } from 'lodash';

import { LOANS_PROGRAM_PUBKEY } from './loans.constants';
import {
  AvailableCollections,
  LoanData,
  LoanDataByPoolPublicKey,
} from './loans.model';

const COLLECTIONS_WHITELIST: AvailableCollections[] = [
  {
    collection_info: '',
    creator: '6wPYbuGRXZjVw2tCeTxwRiQU7AzFDTeFEKuUFpJZpcix',
    description: '',
    name: 'Frakt',
    royalty_address: '6wPYbuGRXZjVw2tCeTxwRiQU7AzFDTeFEKuUFpJZpcix',
    loan_pool: 'Hy7h6FSicyB9B3ZNGtEs64dKzQWk8TuNdG1fgX5ccWFW',
  },
];

export const fetchAvailableCollections = async (): Promise<
  AvailableCollections[]
> => {
  try {
    // const response = await (
    //   await fetch('https://ezekiel9218.github.io/Data/whitelist.json')
    // ).json();

    // return response;

    return await Promise.resolve(COLLECTIONS_WHITELIST);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const fetchLoansProgramAccounts_old = async (
  connection: Connection,
): Promise<any> => {
  return await getAllProgramAccounts(
    new PublicKey(LOANS_PROGRAM_PUBKEY),
    connection,
  );
};

export const fetchLoanDataByPoolPublicKey = async (
  connection: Connection,
): Promise<LoanDataByPoolPublicKey> => {
  const { collectionInfos, deposits, liquidityPools, loans } =
    await getAllProgramAccounts(
      new PublicKey(LOANS_PROGRAM_PUBKEY),
      connection,
    );

  const collectionInfosByPoolPublicKey = keyBy(
    collectionInfos,
    'liquidityPool',
  );
  const depositsByPoolPublicKey = groupBy(deposits, 'liquidityPool');
  const loansByPoolPublicKey = groupBy(loans, 'liquidityPool');

  return liquidityPools?.reduce((loansData, liquidityPool) => {
    const { liquidityPoolPubkey } = liquidityPool;

    return loansData.set(liquidityPoolPubkey, {
      collectionInfo:
        collectionInfosByPoolPublicKey[liquidityPoolPubkey] || null,
      deposits: depositsByPoolPublicKey[liquidityPoolPubkey] || [],
      liquidityPool: liquidityPool,
      loans: loansByPoolPublicKey[liquidityPoolPubkey] || [],
    });
  }, new Map<string, LoanData>());
};
