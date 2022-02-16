import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { groupBy, keyBy, Dictionary } from 'lodash';

import {
  AnchorState,
  RawCommunityPoolBFF,
  CommunityPool,
  CommunityPoolState,
  RawLotteryTicketBFF,
  LotteryTicket,
  LotteryTicketState,
  PoolWhitelist,
  RawPoolWhitelistBFF,
  PoolWhitelistType,
  RawSafetyDepositBoxBFF,
  SafetyDepositBoxState,
  SafetyDepositBox,
  RawNftMetadataBFF,
  SafetyDepositBoxWithNftMetadata,
  NftPoolData,
  RawNftPoolDataBFF,
} from './nftPools.model';

const parseAnchorState = <T>(anchorState: AnchorState): T => {
  const state = Object.keys(anchorState)[0];

  return (state as unknown as T) || null;
};

const parseRawCommunityPool = (
  rawCommunityPoolBFF: RawCommunityPoolBFF,
): CommunityPool => {
  const { publicKey: rawPublicKey, account } = rawCommunityPoolBFF;

  return {
    publicKey: new PublicKey(rawPublicKey),
    authority: new PublicKey(account.authority),
    createdAt: new BN(account.createdAt, 16),
    fractionMint: new PublicKey(account.fractionMint),
    fractionsSupply: new BN(account.fractionsSupply, 16),
    state: parseAnchorState<CommunityPoolState>(account.state),
    tokenProgram: new PublicKey(account.tokenProgram),
    tokenTypeCount: new BN(account.tokenTypeCount, 16),
  };
};

const parseRawLotteryTicket = (
  rawLotteryTicket: RawLotteryTicketBFF,
): LotteryTicket => {
  const { publicKey: rawPublicKey, account } = rawLotteryTicket;

  return {
    publicKey: new PublicKey(rawPublicKey),
    communityPool: new PublicKey(account.communityPool),
    lotteryTicketState: parseAnchorState<LotteryTicketState>(
      account.lotteryTicketState,
    ),
    ticketHolder: new PublicKey(account.ticketHolder),
    winningSafetyBox: new PublicKey(account.winningSafetyBox),
  };
};

const parseRawPoolWhitelist = (
  rawPoolWhitelist: RawPoolWhitelistBFF,
): PoolWhitelist => {
  const { publicKey: rawPublicKey, account } = rawPoolWhitelist;

  return {
    publicKey: new PublicKey(rawPublicKey),
    communityPool: new PublicKey(account.communityPool),
    whitelistType: parseAnchorState<PoolWhitelistType>(account.whitelistType),
    whitelistedAddress: new PublicKey(account.whitelistedAddress),
  };
};

const parseRawSafetyDepositBox = (
  rawSafetyDepositBox: RawSafetyDepositBoxBFF,
): SafetyDepositBox => {
  const { publicKey: rawPublicKey, account } = rawSafetyDepositBox;

  return {
    publicKey: new PublicKey(rawPublicKey),
    communityPool: new PublicKey(account.communityPool),
    nftMint: new PublicKey(account.nftMint),
    safetyBoxState: parseAnchorState<SafetyDepositBoxState>(
      account.safetyBoxState,
    ),
    storeNftTokenAccount: new PublicKey(account.storeNftTokenAccount),
  };
};

export const parseRawNftPools = (
  rawPoolsData: RawNftPoolDataBFF,
): NftPoolData[] => {
  const {
    communityPools: rawCommunityPoolBFF,
    lotteryTickets: rawLotteryTicketsBFF,
    poolWhitelists: rawPoolWhitelists,
    safetyDepositBoxes: rawSafetyDepositBoxes,
    nftsMetadata: rawNftsMetadata,
  } = rawPoolsData;

  const communityPools = (rawCommunityPoolBFF as RawCommunityPoolBFF[]).map(
    (communityPool) => parseRawCommunityPool(communityPool),
  );

  const lotteryTicketsByCommunityPool = groupBy(
    (rawLotteryTicketsBFF as RawLotteryTicketBFF[]).map((lotteryTicket) =>
      parseRawLotteryTicket(lotteryTicket),
    ),
    'communityPool',
  );

  const poolWhitelistsByCommunityPool = groupBy(
    (rawPoolWhitelists as RawPoolWhitelistBFF[]).map((poolWhitelist) =>
      parseRawPoolWhitelist(poolWhitelist),
    ),
    'communityPool',
  );

  const safetyDepositBoxes: SafetyDepositBox[] = (
    rawSafetyDepositBoxes as RawSafetyDepositBoxBFF[]
  )
    .map((safetyDepositBox) => parseRawSafetyDepositBox(safetyDepositBox))
    .filter(
      ({ safetyBoxState }) => safetyBoxState !== SafetyDepositBoxState.EMPTY,
    );

  const rawNftsMetadataByMint = keyBy(
    rawNftsMetadata as RawNftMetadataBFF[],
    'mint',
  );

  const safetyDepositBoxWithNftMetadata = safetyDepositBoxes.reduce(
    (acc: SafetyDepositBoxWithNftMetadata[], safetyDepositBox) => {
      const rawNftMetadata =
        rawNftsMetadataByMint[safetyDepositBox.nftMint?.toBase58()];

      if (rawNftMetadata) {
        const {
          attributes,
          collectionName,
          description,
          image,
          isVerified,
          name,
        } = rawNftMetadata;

        acc.push({
          ...safetyDepositBox,
          nftAttributes: attributes,
          nftCollectionName: collectionName,
          nftDescription: description,
          nftImage: image,
          nftIsVerified: isVerified,
          nftName: name,
        });
      }

      return acc;
    },
    [],
  );

  const safetyDepositBoxesWithMetadataByCommunityPool: Dictionary<
    SafetyDepositBoxWithNftMetadata[]
  > = groupBy(safetyDepositBoxWithNftMetadata, 'communityPool');

  return communityPools.map((communityPool) => {
    const publicKeyString = communityPool.publicKey.toBase58();

    return {
      ...communityPool,
      lotteryTickets: lotteryTicketsByCommunityPool[publicKeyString] || [],
      poolWhitelist: poolWhitelistsByCommunityPool[publicKeyString] || [],
      safetyBoxes:
        safetyDepositBoxesWithMetadataByCommunityPool[publicKeyString] || [],
    };
  });
};
