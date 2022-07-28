import { createSelector } from 'reselect';
import {
  pathOr,
  identity,
  applySpec,
  map,
  converge,
  concat,
  evolve,
  subtract,
  reject,
  __,
  useWith,
  pluck,
  compose,
  mapObjIndexed,
  groupBy,
  prop,
  length,
} from 'ramda';

import { LotteryTicket, RaffleListItem } from './types';

export const selectGraceList = createSelector(
  [pathOr([], ['liquidations', 'graceList', 'data'])],
  identity,
);

export const selectWonRaffleList = createSelector(
  [pathOr([], ['liquidations', 'wonRaffleList', 'data'])],
  identity,
);

export const selectRaffleList = createSelector(
  [pathOr([], ['liquidations', 'raffleList', 'data']), selectWonRaffleList],
  useWith(
    (raffleList: Array<RaffleListItem>, wonMints: string[]) =>
      reject(
        (item: RaffleListItem) => wonMints.includes(item.nftMint),
        raffleList,
      ),
    [identity, pluck('nftMint')],
  ),
);

const selectIgnoreLotteryTickets = createSelector(
  [pathOr([], ['liquidations', 'ignoreLotteryTicketsList'])],
  identity,
);

const selectRawLotteryTickets = createSelector(
  [pathOr({}, ['liquidations', 'lotteryTicketsList', 'data'])],
  applySpec<{ quantity: number; tickets: LotteryTicket[] }>({
    quantity: pathOr(0, ['totalTickets']),
    tickets: converge(
      (nftMints: number[], stakedNfts: any) => {
        const rawNfts = map(applySpec({ nftMint: identity }), nftMints);
        return concat(rawNfts, stakedNfts);
      },
      [pathOr([], ['nftMints']), pathOr([], ['stakedNfts'])],
    ),
  }),
);

export const selectLotteryTickets = createSelector(
  [selectRawLotteryTickets, selectIgnoreLotteryTickets],
  (lotteryTickets, ignoreNfts) => {
    return evolve(
      {
        quantity: subtract(__, ignoreNfts.length),
        tickets: reject((ticket: any) => ignoreNfts.includes(ticket.nftMint)),
      },
      lotteryTickets,
    );
  },
);

export const selectTxRaffleTryStatus = createSelector(
  [pathOr('IDLE', ['liquidations', 'txRaffleTry', 'status'])],
  identity,
);

export const selectTxLiquidateStatus = createSelector(
  [pathOr('IDLE', ['liquidations', 'txLiquidate', 'status'])],
  identity,
);

export const selectCollectionsDropdownData = createSelector(
  [pathOr([], ['liquidations', 'collectionsList', 'data'])],
  map((item: any) => ({
    label: item,
    value: item,
  })),
);

export const selectRaffleNotifications = createSelector(
  [pathOr([], ['liquidations', 'raffleNotifications', 'data'])],
  compose(mapObjIndexed(length), groupBy(prop('ticketState'))),
);
