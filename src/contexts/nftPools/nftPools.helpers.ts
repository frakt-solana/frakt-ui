import { Dictionary } from 'lodash';
import { NftPoolData, PoolWhitelistType } from '../../utils/cacher/nftPools';

import { UserNFT } from '../../state/userTokens/types';

export const getWhitelistedMintsDictionary = (
  pool: NftPoolData,
): Dictionary<boolean> => {
  return Object.fromEntries(
    pool.poolWhitelist
      .filter(
        ({ whitelistType }) =>
          whitelistType === PoolWhitelistType.SINGLE_NFT_WHITELIST,
      )
      .map(({ whitelistedAddress }) => [whitelistedAddress.toBase58(), true]),
  );
};

export const getWhitelistedCreatorsDictionary = (
  pool: NftPoolData,
): Dictionary<boolean> => {
  return Object.fromEntries(
    pool.poolWhitelist
      .filter(
        ({ whitelistType }) =>
          whitelistType === PoolWhitelistType.CREATOR_WHITELIST,
      )
      .map(({ whitelistedAddress }) => [whitelistedAddress.toBase58(), true]),
  );
};

export const isNFTWhitelistedByCreator = (
  nft: UserNFT,
  whitelistedCreatorsDictionary: Dictionary<boolean>,
): string | null => {
  const { metadata } = nft;

  //? Fallback for old nft metadata fetching instead of quickNode
  // const nftCreatorsArray =
  //   metadata?.properties?.creators?.map(({ address }) => address) || [];

  // const whitelistedCreators = Object.keys(whitelistedCreatorsDictionary);

  // const whitelistedCreator = whitelistedCreators.find((whitelistedCreator) =>
  //   nftCreatorsArray.includes(whitelistedCreator),
  // );

  const nftCreatorAddresses =
    metadata?.properties?.creators
      ?.filter(({ verified }) => !!verified)
      ?.map(({ address }) => address) || [];

  const whitelistedCreatorsAddresses = Object.keys(
    whitelistedCreatorsDictionary,
  );

  const whitelistedCreator = whitelistedCreatorsAddresses.find(
    (whitelistedCreatorAddress) =>
      nftCreatorAddresses.includes(whitelistedCreatorAddress),
  );

  return whitelistedCreator || null;
};

export const isNFTWhitelistedByMint = (
  nft: UserNFT,
  whitelistedMintsDictionary: Dictionary<boolean>,
): string | null => {
  const { mint } = nft;

  return whitelistedMintsDictionary[mint] ? mint : null;
};

export const isNFTWhitelisted = (
  nft: UserNFT,
  whitelistedMintsDictionary: Dictionary<boolean>,
  whitelistedCreatorsDictionary: Dictionary<boolean>,
): boolean => {
  return (
    (!!isNFTWhitelistedByMint(nft, whitelistedMintsDictionary) ||
      !!isNFTWhitelistedByCreator(nft, whitelistedCreatorsDictionary)) &&
    !nft?.metadata?.name?.includes('SSBxSolPunk')
  );
};

export const filterWhitelistedNFTs = (
  nfts: UserNFT[],
  whitelistedMintsDictionary: Dictionary<boolean>,
  whitelistedCreatorsDictionary: Dictionary<boolean>,
): UserNFT[] =>
  nfts.filter((nft) =>
    isNFTWhitelisted(
      nft,
      whitelistedMintsDictionary,
      whitelistedCreatorsDictionary,
    ),
  );
