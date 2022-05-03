import {
  CollectionInfoView,
  getAllProgramAccounts,
} from '@frakters/nft-lending-v2';
import { Connection, PublicKey } from '@solana/web3.js';
import { groupBy } from 'lodash';
import { UserNFT } from '../userTokens';

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

type GetFeePercent = (props: { nft?: UserNFT; loanData: LoanData }) => number;

export const getFeePercent: GetFeePercent = ({ loanData, nft }) => {
  const PERCENT_PRECISION = 100;

  const nftCreator =
    nft?.metadata?.properties?.creators?.find(({ verified }) => verified)
      ?.address || '';

  const royaltyFeeRaw =
    loanData?.collectionsInfo?.find(({ creator }) => creator === nftCreator)
      ?.royaltyFee || 0;

  const rewardInterestRateRaw =
    loanData?.liquidityPool?.rewardInterestRate || 0;

  const feeInterestRateRaw = loanData?.liquidityPool?.feeInterestRate || 0;

  const feesPercent =
    (royaltyFeeRaw + rewardInterestRateRaw + feeInterestRateRaw) /
    (100 * PERCENT_PRECISION);

  return feesPercent || 0;
};

const ORACLE_URL_BASE =
  'https://nft-lending-v2-node.herokuapp.com/v1/getpricebycreator';

export const getNftMarketLowerPriceByCreator = async (
  creatorAddress: string,
): Promise<number | null> => {
  try {
    const url = `${ORACLE_URL_BASE}/${creatorAddress}`;

    const responseData = await (await fetch(url)).json();

    return responseData?.lower || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return null;
  }
};
