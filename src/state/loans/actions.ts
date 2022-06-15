import { createCustomAction } from 'typesafe-actions';

import { BorrowNft } from './types';

export const loansTypes = {
  SET_LOANS: 'loans/SET_LOANS',
  SET_LENDING: 'loans/SET_LENDING',
  SET_BORROW_NFTS: 'loans/SET_BORROW_NFTS',
};

export const loansActions = {
  setLoans: createCustomAction(loansTypes.SET_LOANS, (loans: any) => ({
    payload: loans,
  })),
  setLending: createCustomAction(loansTypes.SET_LENDING, (lending: any) => ({
    payload: lending,
  })),
  setBorrowNfts: createCustomAction(
    loansTypes.SET_BORROW_NFTS,
    (nfts: BorrowNft[]) => ({ payload: nfts }),
  ),
};
