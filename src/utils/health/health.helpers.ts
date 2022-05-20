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
import { SolanaNetworkHealth } from './health.model';

const SOLANA_SLOW_LOSS_CUTOFF = 25;
const SOLANA_DOWN_LOSS_CUTOFF = 50;

const average = converge(divide, [sum, length]);
const convertPercentToNumber = compose(Number, head, split('.'));

async function getRecentAverageLoss(minutesLookback: number) {
  const pingData = await (
    await fetch('https://ping.solana.com/mainnet-beta/last6hours')
  ).json();
  return compose(
    average,
    map(convertPercentToNumber),
    pluck('loss'),
    take(minutesLookback),
  )(pingData);
}

export default async function getSolanaNetworkHealth(
  minutesLookback: number,
  solanaSlowLossCutoff = SOLANA_SLOW_LOSS_CUTOFF,
  solanaDownLossCutoff = SOLANA_DOWN_LOSS_CUTOFF,
) {
  const loss = await getRecentAverageLoss(minutesLookback);

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
}
