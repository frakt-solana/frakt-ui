import { createSelector } from 'reselect';
import {
  pathOr,
  compose,
  ifElse,
  filter,
  propSatisfies,
  includes,
  indexBy,
  prop,
  identity,
  equals,
} from 'ramda';
import { ensureArray, isMap } from 'ramda-adjunct';
import { TokenInfo } from '@frakt-protocol/frakt-sdk';

import { TokenListState } from './types';
import { FRKT_TOKEN_MINT_PUBLIC_KEY } from '../../config';
import { RequestStatus } from '../../utils/state';

//? Add some external spl tokens in swappableTokensMap
const ADDITIONAL_SWAPPABLE_TOKENS_MINTS = [
  FRKT_TOKEN_MINT_PUBLIC_KEY,
  // '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', //? RAY
];

const convertToMap: (v: Record<string, TokenInfo>) => Map<string, TokenInfo> = (
  v,
) => new Map(Object.entries(v));
const isNonEmptyMap = (v): boolean => isMap(v) && !!v.size;

export const selectTokenList: (state) => Array<TokenInfo> = createSelector(
  [pathOr([], ['tokenList', 'data', 'tokens'])],
  identity,
);

export const selectFraktTokenList: (state) => Array<TokenInfo> = createSelector(
  [selectTokenList],
  filter(
    propSatisfies(compose(includes('frakt-nft-pool'), ensureArray), 'tags'),
  ),
);

export const selectTokenMap: (state) => Map<string, TokenInfo> = createSelector(
  [selectTokenList],
  compose(convertToMap, indexBy(prop('address'))),
);

export const selectFraktTokenRawMap = createSelector(
  [selectFraktTokenList],
  compose(convertToMap, indexBy(prop('address'))),
);

export const selectFraktTokenMap = createSelector(
  [selectFraktTokenRawMap, selectTokenMap],
  (fraktTokenRawMap, tokenMap) =>
    ifElse(
      isNonEmptyMap,
      (fraktTokenRawMap) => {
        ADDITIONAL_SWAPPABLE_TOKENS_MINTS.forEach((mint) => {
          const token = tokenMap.get(mint);
          if (token) {
            fraktTokenRawMap.set(mint, token);
          }
        });
        return fraktTokenRawMap;
      },
      identity,
    )(fraktTokenRawMap),
);

export const selectLoading = createSelector(
  [pathOr('', ['tokenList', 'status'])],
  equals(RequestStatus.PENDING),
);

export const selectTokenListState: (state) => TokenListState = createSelector(
  [
    selectTokenList,
    selectFraktTokenList,
    selectTokenMap,
    selectFraktTokenMap,
    selectLoading,
  ],
  (tokensList, fraktionTokensList, tokensMap, fraktionTokensMap, loading) => ({
    tokensList,
    fraktionTokensList,
    tokensMap,
    fraktionTokensMap,
    loading,
  }),
);
