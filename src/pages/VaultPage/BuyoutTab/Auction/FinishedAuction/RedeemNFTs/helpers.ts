export const getButtonText = (
  tokenTypeCount: number,
  isVaultLocked: boolean,
): string => {
  const redeemText = `Redeem ${tokenTypeCount > 1 ? tokenTypeCount : ''} NFT${
    tokenTypeCount > 1 ? 's' : ''
  }`;
  return `${isVaultLocked ? 'Unlock and ' : ''}${redeemText}`;
};
