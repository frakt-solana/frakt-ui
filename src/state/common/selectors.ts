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
  ifElse,
  identity,
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

const isNumber = (value) => typeof value === 'number';
const isFullString = (value) => typeof value === 'string' && !!value.length;
const average = ifElse(
  isNumber,
  converge<any, any, any>(divide, [sum, length]),
  identity,
);
const convertPercentToNumber: (string) => number = ifElse(
  isFullString,
  compose(Number, head, split('.')),
  identity,
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
