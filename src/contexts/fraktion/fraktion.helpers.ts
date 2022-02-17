import { SafetyBoxWithMetadata } from './fraktion.model';
import { UserNFT } from '../userTokens';

export const safetyBoxWithNftMetadataToUserNFT = (
  safetyBox: SafetyBoxWithMetadata,
): UserNFT => {
  const { nftAttributes, nftDescription, nftImage, nftMint, nftName } =
    safetyBox;

  return {
    mint: nftMint,
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
