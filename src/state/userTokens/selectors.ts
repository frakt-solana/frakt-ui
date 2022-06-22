import { createSelector } from 'reselect';
import {
  pathOr,
  compose,
  filter,
  indexBy,
  prop,
  identity,
  pluck,
  pickBy,
  propEq,
  values,
  equals,
} from 'ramda';

import { isTokenFrozen } from './helpers';
import { RequestStatus } from '../../utils/state';
import { UserNFT } from './types';

export const selectUserTokensPending: (state) => boolean = createSelector(
  [pathOr('', ['userTokens', 'userTokens', 'status'])],
  equals(RequestStatus.PENDING),
);

export const selectUserTokens: (state) => UserNFT[] = createSelector(
  [pathOr([], ['userTokens', 'userTokens', 'data'])],
  identity,
);

export const selectRawUserTokensByMint: (state) => Record<string, any> =
  createSelector([selectUserTokens], indexBy(prop('mint')));

export const selectPossibleNftTokens: (state) => UserNFT[] = createSelector(
  [selectRawUserTokensByMint],
  compose(values, pickBy(propEq('amount', 1))),
);

export const selectFrozenNftMints: (state) => string[] = createSelector(
  [selectPossibleNftTokens],
  compose<any, any[], string[]>(pluck('mint'), filter(isTokenFrozen)),
);

export const selectWalletNftsPending: (state) => boolean = createSelector(
  [pathOr('', ['userTokens', 'walletNfts', 'status'])],
  equals(RequestStatus.PENDING),
);

export const selectAllWalletNfts: (state) => UserNFT[] = createSelector(
  [pathOr([], ['userTokens', 'walletNfts', 'data'])],
  identity,
);

export const selectNotFrozenWalletNfts: (state) => UserNFT[] = createSelector(
  [selectFrozenNftMints, selectAllWalletNfts],
  (frozenNFTsMints, userNFTs) => {
    return userNFTs?.filter(({ mint }) => !frozenNFTsMints.includes(mint));
  },
);

export const selectUserTokensState = createSelector(
  [
    selectNotFrozenWalletNfts,
    selectAllWalletNfts,
    selectRawUserTokensByMint,
    selectUserTokensPending,
    selectWalletNftsPending,
  ],
  (nfts, allNfts, rawUserTokensByMint, loading, nftsLoading) => ({
    nfts,
    allNfts,
    rawUserTokensByMint,
    loading,
    nftsLoading,
  }),
);
