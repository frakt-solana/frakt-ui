/* eslint-disable */

import { TokenInfo } from '@solana/spl-token-registry';

export const validators = {
  buyoutPrice: (_: any, value: { amount: string }) => {
    if (!value.amount.length)
      return Promise.reject('Buyout price must be in the range: 1 - 50k');

    if (
      value.amount.length &&
      (Number(value.amount) < 1 || Number(value.amount) > 50000)
    ) {
      return Promise.reject('Buyout price must be in the range: 1 - 50k');
    }
    return Promise.resolve();
  },
  ticker: (tokenList: TokenInfo[]) => (_: any, value: string) => {
    if (!value.length)
      return Promise.reject("Invalid ticker name or it's already in use");

    if (
      value.length &&
      (value.length < 3 || tokenList.find(({ symbol }) => symbol === value))
    ) {
      return Promise.reject("Invalid ticker name or it's already in use");
    }
    return Promise.resolve();
  },
  supply: (_: any, value: string) => {
    if (!value.length)
      return Promise.reject('Supply must be in the range: 1k - 100kk');

    if (value.length && (Number(value) < 1000 || Number(value) > 1e8)) {
      return Promise.reject('Supply must be in the range: 1k - 100kk');
    }
    return Promise.resolve();
  },
  validateFractionPrice: (buyoutPrice: string, supply: string) => {
    if (
      supply?.length &&
      buyoutPrice?.length &&
      Number(buyoutPrice) / Number(supply) < 1e-6
    ) {
      return 'Price per fraktion must be greater than 1e-6';
    }
    return null;
  },
  backetName: (tokenList: TokenInfo[]) => (_: any, value: string) => {
    if (!value?.length) return Promise.resolve();

    if (
      (value.length && value.length < 3) ||
      tokenList.find(({ name }) => name === value)
    ) {
      return Promise.reject("Invalid basket name or it's already in use");
    }

    return Promise.resolve();
  },
};
