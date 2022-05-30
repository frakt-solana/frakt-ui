import { createSelector } from 'reselect';
import {
  pathOr,
  compose,
  map,
  converge,
  divide,
  length,
  sum,
  head,
  split,
  pluck,
  take,
  ifElse,
  identity,
} from 'ramda';
import { isNumber, isNonEmptyString } from 'ramda-adjunct';

import { SolanaHealthResponse, SolanaNetworkHealth } from './types';

const SOLANA_SLOW_LOSS_CUTOFF = 25;
const SOLANA_DOWN_LOSS_CUTOFF = 50;

const isNumberArray = (value: unknown) =>
  Array.isArray(value) && value.length && value.every(isNumber);
const average = ifElse(
  isNumberArray,
  converge<number[], (number, numer) => number, Array<(number) => number>>(
    divide,
    [sum, length],
  ),
  identity,
);
const convertPercentToNumber: (string) => number = ifElse(
  isNonEmptyString,
  compose(Number, head, split('.')),
  identity,
);

export const selectSolanaLoss = createSelector(
  [pathOr([], ['common', 'fetchSolanaHealth', 'data'])],
  compose<
    unknown[],
    Array<SolanaHealthResponse>,
    Array<string>,
    Array<number>,
    unknown
  >(average, map(convertPercentToNumber), pluck('loss'), take(10)),
);

export const selectSolanaHealth = createSelector(
  [selectSolanaLoss],
  (loss: number | null) => {
    if (loss === null) {
      return { health: SolanaNetworkHealth.Down, loss: null };
    }
    if (loss > SOLANA_DOWN_LOSS_CUTOFF) {
      return { health: SolanaNetworkHealth.Down, loss };
    }
    if (loss > SOLANA_SLOW_LOSS_CUTOFF) {
      return { health: SolanaNetworkHealth.Slow, loss };
    }
    return { health: SolanaNetworkHealth.Good, loss };
  },
);

export const selectNotification = createSelector(
  [pathOr(null, ['common', 'notification'])],
  identity,
);

export const selectWalletModalVisible = createSelector(
  [pathOr(false, ['common', 'walletModal', 'isVisible'])],
  identity,
);
