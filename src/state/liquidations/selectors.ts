import { createSelector } from 'reselect';
import {
  pathOr,
  identity,
  applySpec,
  length,
  head,
  compose,
  map,
  pluck,
  uniq,
} from 'ramda';

const createCollectionNameDropdown = compose(
  map((item: any) => ({
    label: item,
    value: item ? item.replace(' ', '_') : '',
  })),
  uniq,
  pluck('nftCollectionName'),
);

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
    attempt: head,
  }),
);

export const selectTxRaffleTryStatus = createSelector(
  [pathOr('IDLE', ['liquidations', 'txRaffleTry', 'status'])],
  identity,
);

export const selectTxLiquidateStatus = createSelector(
  [pathOr('IDLE', ['liquidations', 'txLiquidate', 'status'])],
  identity,
);

export const selectRaffleListCollections = createSelector(
  [selectRaffleList],
  createCollectionNameDropdown,
);

export const selectWonRaffleListCollections = createSelector(
  [selectWonRaffleList],
  createCollectionNameDropdown,
);
