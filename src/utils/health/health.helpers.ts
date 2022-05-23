import {
  converge,
  compose,
  sum,
  length,
  divide,
  take,
  pluck,
  head,
  split,
  map,
} from 'ramda';

import {
  PingDataValues,
  SolanaNetworkHealth,
  SolanaNetworkHealthValues,
} from './health.model';

const SOLANA_SLOW_LOSS_CUTOFF = 25;
const SOLANA_DOWN_LOSS_CUTOFF = 50;

const average = converge<any, any, any>(divide, [sum, length]);
const convertPercentToNumber: (string) => number = compose(
  Number,
  head,
  split('.'),
);

async function getRecentAverageLoss(minutesLookback: number): Promise<number> {
  const pingData: Array<[PingDataValues]> = await (
    await fetch('https://ping.solana.com/mainnet-beta/last6hours')
  ).json();

  const getData = compose<
    any[],
    Array<PingDataValues>,
    Array<string>,
    Array<number>,
    any
  >(average, map(convertPercentToNumber), pluck('loss'), take(minutesLookback));

  return getData(pingData);
}

const getSolanaNetworkHealth = async (
  minutesLookback: number,
  solanaSlowLossCutoff = SOLANA_SLOW_LOSS_CUTOFF,
  solanaDownLossCutoff = SOLANA_DOWN_LOSS_CUTOFF,
): Promise<SolanaNetworkHealthValues> => {
  const loss: number = await getRecentAverageLoss(minutesLookback);

  if (loss === null) {
    return { health: SolanaNetworkHealth.Down, loss: null };
  }
  if (loss > solanaDownLossCutoff) {
    return { health: SolanaNetworkHealth.Down, loss };
  }
  if (loss > solanaSlowLossCutoff) {
    return { health: SolanaNetworkHealth.Slow, loss };
  }
  return { health: SolanaNetworkHealth.Good, loss };
};

export { getSolanaNetworkHealth as default };
