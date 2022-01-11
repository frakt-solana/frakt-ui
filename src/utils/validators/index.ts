/* eslint-disable */
import { isNumber, isInteger } from 'lodash';
import { TokenInfo } from '@solana/spl-token-registry';

export const validators = {
  buyoutPrice: (_: any, value: string): Promise<void | string> => {
    if (!value.length)
      return Promise.reject('Buyout price must be in the range: 1 - 50k');

    if (value.length && (Number(value) < 1 || Number(value) > 50000)) {
      return Promise.reject('Buyout price must be in the range: 1 - 50k');
    }
    return Promise.resolve();
  },
  ticker:
    (tokenList: TokenInfo[]) =>
    (_: any, value: string): Promise<void | string> => {
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
  supply: (_: any, value: string): Promise<void | string> => {
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
  vaultName:
    (tokenList: TokenInfo[]) =>
    (_: any, value: string): Promise<void | string> => {
      if (value?.length < 3)
        return Promise.reject("Invalid vault name or it's already in use");

      if (
        (value.length && value.length < 3) ||
        tokenList.find(({ name }) => name === value)
      ) {
        return Promise.reject("Invalid vault name or it's already in use");
      }

      return Promise.resolve();
    },
  // tickSize: (_: any, value: string): Promise<void | string> => {
  //   if (
  //     !isNumber(+value) ||
  //     !isInteger(+value) ||
  //     Number(value) < 1 ||
  //     isNaN(Number(value))
  //   )
  //     return Promise.reject('Tick size must be great than 1 real number');

  //   return Promise.resolve();
  // },
};

// export const getConditionalValidator = (condition, rules: any[]) => {
//   return condition ? rules : [];
// };
