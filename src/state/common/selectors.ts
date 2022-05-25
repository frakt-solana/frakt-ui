import { createSelector } from 'reselect';
import {
  path,
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
  isNil,
  ifElse,
  identity,
  isEmpty,
  anyPass,
} from 'ramda';

const SOLANA_SLOW_LOSS_CUTOFF = 25;
const SOLANA_DOWN_LOSS_CUTOFF = 50;

export interface PingDataValues {
  loss: string;
}

export enum SolanaNetworkHealth {
  Down = 'Down',
  Slow = 'Slow',
  Good = 'Good',
}

const isNilOrEmpty = anyPass([isNil, isEmpty]);
const average = ifElse(
  isNilOrEmpty,
  identity,
  converge<any, any, any>(divide, [sum, length]),
);
const convertPercentToNumber: (string) => number = ifElse(
  isNilOrEmpty,
  identity,
  compose(Number, head, split('.')),
);

export const selectSolanaLoss = createSelector(
  [pathOr([], ['common', 'fetchSolanaHealth', 'data'])],
  compose<any[], Array<PingDataValues>, Array<string>, Array<number>, any>(
    average,
    map(convertPercentToNumber),
    pluck('loss'),
    take(10),
  ),
);

export const selectSolanaHealth = createSelector(
  [selectSolanaLoss],
  (loss: any) => {
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
  [path(['common', 'notification'])],
  identity,
);
