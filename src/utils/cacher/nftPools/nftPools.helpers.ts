import { BN, web3 } from '@frakt-protocol/frakt-sdk';
import { groupBy, keyBy, Dictionary } from 'lodash';

import { UserNFT } from '../../../state/userTokens/types';
import { CUSTOM_POOLS_URLS } from './nftPools.constants';
import {
  AnchorState,
  RawCommunityPool,
  CommunityPool,
  CommunityPoolState,
  RawLotteryTicket,
  LotteryTicket,
  LotteryTicketState,
  PoolWhitelist,
  RawPoolWhitelist,
  PoolWhitelistType,
  RawSafetyDepositBox,
  SafetyDepositBoxState,
  SafetyDepositBox,
  RawNftMetadata,
  SafetyDepositBoxWithNftMetadata,
  NftPoolData,
  RawNftPoolData,
} from './nftPools.model';

const parseAnchorState = <T>(anchorState: AnchorState): T => {
  const state = Object.keys(anchorState)[0];

  return (state as unknown as T) || null;
};

const parseRawCommunityPool = (
  rawCommunityPool: RawCommunityPool,
): CommunityPool => {
  const { publicKey: rawPublicKey, account } = rawCommunityPool;

  return {
    publicKey: new web3.PublicKey(rawPublicKey),
    authority: new web3.PublicKey(account.authority),
    createdAt: new BN(account.createdAt, 16),
    fractionMint: new web3.PublicKey(account.fractionMint),
    fractionsSupply: new BN(account.fractionsSupply, 16),
    state: parseAnchorState<CommunityPoolState>(account.state),
    tokenProgram: new web3.PublicKey(account.tokenProgram),
    tokenTypeCount: new BN(account.tokenTypeCount, 16),
    customName: CUSTOM_POOLS_URLS[rawPublicKey],
  };
};

const parseRawLotteryTicket = (
  rawLotteryTicket: RawLotteryTicket,
): LotteryTicket => {
  const { publicKey: rawPublicKey, account } = rawLotteryTicket;

  return {
    publicKey: new web3.PublicKey(rawPublicKey),
    communityPool: new web3.PublicKey(account.communityPool),
    lotteryTicketState: parseAnchorState<LotteryTicketState>(
      account.lotteryTicketState,
    ),
    ticketHolder: new web3.PublicKey(account.ticketHolder),
    winningSafetyBox: new web3.PublicKey(account.winningSafetyBox),
  };
};

const parseRawPoolWhitelist = (
  rawPoolWhitelist: RawPoolWhitelist,
): PoolWhitelist => {
  const { publicKey: rawPublicKey, account } = rawPoolWhitelist;

  return {
    publicKey: new web3.PublicKey(rawPublicKey),
    communityPool: new web3.PublicKey(account.communityPool),
    whitelistType: parseAnchorState<PoolWhitelistType>(account.whitelistType),
    whitelistedAddress: new web3.PublicKey(account.whitelistedAddress),
  };
};

const parseRawSafetyDepositBox = (
  rawSafetyDepositBox: RawSafetyDepositBox,
): SafetyDepositBox => {
  const { publicKey: rawPublicKey, account } = rawSafetyDepositBox;

  return {
    publicKey: new web3.PublicKey(rawPublicKey),
    communityPool: new web3.PublicKey(account.communityPool),
    nftMint: new web3.PublicKey(account.nftMint),
    safetyBoxState: parseAnchorState<SafetyDepositBoxState>(
      account.safetyBoxState,
    ),
    storeNftTokenAccount: new web3.PublicKey(account.storeNftTokenAccount),
  };
};

const getSafetyDepositBoxWithNftMetadata = (
  safetyDepositBoxes: SafetyDepositBox[],
  rawNftsMetadata: RawNftMetadata[],
) => {
  const rawNftsMetadataByMint = keyBy(rawNftsMetadata, 'mint');

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

  return safetyDepositBoxWithNftMetadata;
};

export const safetyDepositBoxWithNftMetadataToUserNFT = (
  safetyBox: SafetyDepositBoxWithNftMetadata,
): UserNFT => {
  const { nftAttributes, nftDescription, nftImage, nftMint, nftName } =
    safetyBox;

  return {
    mint: nftMint.toBase58(),
    metadata: {
      name: nftName,
      symbol: nftName,
      description: nftDescription,
      image: nftImage,
      animation_url: nftImage,
      external_url: '',
      attributes: nftAttributes,
      properties: {},
    },
  };
};

export const parseRawNftPools = (
  rawPoolsData: RawNftPoolData,
): NftPoolData[] => {
  const {
    communityPools: rawCommunityPoolBFF,
    lotteryTickets: rawLotteryTicketsBFF,
    poolWhitelists: rawPoolWhitelists,
    safetyDepositBoxes: rawSafetyDepositBoxes,
    nftsMetadata: rawNftsMetadata,
  } = rawPoolsData;

  const communityPools = (rawCommunityPoolBFF as RawCommunityPool[]).map(
    parseRawCommunityPool,
  );

  const lotteryTicketsByCommunityPool = groupBy(
    (rawLotteryTicketsBFF as RawLotteryTicket[]).map(parseRawLotteryTicket),
    'communityPool',
  );

  const poolWhitelistsByCommunityPool = groupBy(
    (rawPoolWhitelists as RawPoolWhitelist[]).map(parseRawPoolWhitelist),
    'communityPool',
  );

  const safetyDepositBoxes: SafetyDepositBox[] = (
    rawSafetyDepositBoxes as RawSafetyDepositBox[]
  )
    .map(parseRawSafetyDepositBox)
    .filter(
      ({ safetyBoxState }) => safetyBoxState !== SafetyDepositBoxState.EMPTY,
    );

  const safetyDepositBoxesWithNftMetadata = getSafetyDepositBoxWithNftMetadata(
    safetyDepositBoxes,
    rawNftsMetadata,
  );

  const safetyDepositBoxesWithMetadataByCommunityPool: Dictionary<
    SafetyDepositBoxWithNftMetadata[]
  > = groupBy(safetyDepositBoxesWithNftMetadata, 'communityPool');

  return communityPools.map((communityPool) => {
    const publicKeyString = communityPool.publicKey.toBase58();

    return {
      ...communityPool,
      lotteryTickets: lotteryTicketsByCommunityPool[publicKeyString] || [],
      poolWhitelist: poolWhitelistsByCommunityPool[publicKeyString] || [],
      safetyBoxes:
        safetyDepositBoxesWithMetadataByCommunityPool[publicKeyString]?.sort(
          (safetyBoxA, safetyBoxB) =>
            safetyBoxB.nftImage.localeCompare(safetyBoxA.nftImage),
        ) || [],
    };
  });
};
