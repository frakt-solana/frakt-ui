import { Dictionary } from 'lodash';
import { NftPoolData, PoolWhitelistType } from '../../utils/cacher/nftPools';

import { UserNFT } from '../userTokens';

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

  const nftCreatorsArray =
    metadata?.properties?.creators?.map(({ address }) => address) || [];

  const whitelistedCreators = Object.keys(whitelistedCreatorsDictionary);

  const whitelistedCreator = whitelistedCreators.find((whitelistedCreator) =>
    nftCreatorsArray.includes(whitelistedCreator),
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
    !!isNFTWhitelistedByMint(nft, whitelistedMintsDictionary) ||
    !!isNFTWhitelistedByCreator(nft, whitelistedCreatorsDictionary)
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
