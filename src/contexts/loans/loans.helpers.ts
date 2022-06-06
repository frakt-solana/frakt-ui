import {
  CollectionInfoView,
  getAllProgramAccounts,
  LoanView,
} from '@frakters/nft-lending-v2';
import { Connection, PublicKey } from '@solana/web3.js';
import { groupBy, Dictionary } from 'lodash';

import { getNftCreators, SOL_TOKEN } from '../../utils';
import { UserNFT } from '../../state/userTokens/types';

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

  const nftCreators = getNftCreators(nft);

  const royaltyFeeRaw =
    loanData?.collectionsInfo?.find(({ creator }) =>
      nftCreators.includes(creator),
    )?.royaltyFeeTime || 0;

  const rewardInterestRateRaw =
    loanData?.liquidityPool?.rewardInterestRateTime || 0;

  const feeInterestRateRaw = loanData?.liquidityPool?.feeInterestRateTime || 0;

  const feesPercent =
    (royaltyFeeRaw + rewardInterestRateRaw + feeInterestRateRaw) /
    (100 * PERCENT_PRECISION);

  return feesPercent || 0;
};

type GetNftReturnPeriod = (props: {
  nft?: UserNFT;
  loanData: LoanData;
}) => number;

export const getNftReturnPeriod: GetNftReturnPeriod = ({ loanData, nft }) => {
  const nftCreators = getNftCreators(nft);

  const returnPeriod =
    loanData?.collectionsInfo?.find(({ creator }) =>
      nftCreators.includes(creator),
    )?.expirationTime || 0;

  return returnPeriod;
};

const ORACLE_URL_BASE = 'https://nft-price-aggregator.herokuapp.com';

export const getNftMarketLowerPriceByCreator = async (
  creatorAddress: string,
): Promise<number | null> => {
  try {
    const url = `${ORACLE_URL_BASE}/creator/${creatorAddress}`;

    const responseData = await (await fetch(url)).json();

    return responseData?.floor_price || null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return null;
  }
};

type GetNftMarketLowerPricesByCreators = (
  creatorsAddresses: string[],
) => Promise<Dictionary<number>>;

export const getNftMarketLowerPricesByCreators: GetNftMarketLowerPricesByCreators =
  async (creatorsAddresses = []) => {
    try {
      const url = `${ORACLE_URL_BASE}/creators`;

      const responseData: Dictionary<number> = await (
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(creatorsAddresses),
        })
      ).json();

      return responseData;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      return {};
    }
  };

export const getAmountToReturnForPriceBasedLoan = (loan: LoanView): number => {
  const { amountToGet, rewardAmount, feeAmount, royaltyAmount } = loan;

  return (
    (amountToGet + rewardAmount + feeAmount + royaltyAmount) /
    10 ** SOL_TOKEN.decimals
  );
};
