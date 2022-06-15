import {
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
import { isNonEmptyString, isNumber, toNumber } from 'ramda-adjunct';

import {
  SolanaHealthResponse,
  SolanaHealthState,
  SolanaNetworkHealth,
} from './types';

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
const convertPercentToNumber: (string: string) => number = ifElse(
  isNonEmptyString,
  compose(Number, head, split('.')),
  identity,
);

export const parseSolanaHealth = (
  response: SolanaHealthResponse[],
): SolanaHealthState => {
  const SOLANA_SLOW_LOSS_CUTOFF = 25;
  const SOLANA_DOWN_LOSS_CUTOFF = 50;

  const loss = compose<
    unknown[],
    SolanaHealthResponse[],
    Array<string>,
    Array<number>,
    unknown,
    number
  >(
    toNumber,
    average,
    map(convertPercentToNumber),
    pluck('loss'),
    take(10),
  )(response);

  if (loss === null || isNaN(loss)) {
    return { health: SolanaNetworkHealth.Down, loss: null };
  }
  if (loss > SOLANA_DOWN_LOSS_CUTOFF) {
    return { health: SolanaNetworkHealth.Down, loss };
  }
  if (loss > SOLANA_SLOW_LOSS_CUTOFF) {
    return { health: SolanaNetworkHealth.Slow, loss };
  }
  return { health: SolanaNetworkHealth.Good, loss };
};
