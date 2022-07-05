import { createSelector } from 'reselect';
import { pathOr, identity, applySpec, length } from 'ramda';

export const selectGraceList = createSelector(
  [pathOr([], ['liquidations', 'graceList', 'data'])],
  identity,
);

export const selectRaffleList = createSelector(
  [pathOr([], ['liquidations', 'raffleList', 'data'])],
  identity,
);

export const selectWonRaffleList = createSelector(
  [pathOr([], ['liquidations', 'wonRaffleList', 'data'])],
  identity,
);

export const selectLotteryTickets = createSelector(
  [pathOr([], ['liquidations', 'lotteryTicketsList', 'data', 'nftMints'])],
  applySpec<{ quantity: number }>({
    quantity: length,
  }),
);
