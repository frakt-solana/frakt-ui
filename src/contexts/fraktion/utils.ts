import BN from 'bn.js';

export const adjustPricePerFraction = (
  pricePerFraction: BN,
  fractionsAmount: BN,
): BN => {
  if (pricePerFraction.mul(fractionsAmount).lt(new BN(1 * 1e9))) {
    return pricePerFraction.add(new BN(1));
  }
  return pricePerFraction;
};
