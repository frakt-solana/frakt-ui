import { createCustomAction } from 'typesafe-actions';

import { BorrowNft, LiquidityPoolsState } from './types';

export const loansTypes = {
  SET_LOANS: 'loans/SET_LOANS',
  SET_LENDINGS: 'loans/SET_LENDINGS',
  SET_BORROW_NFTS: 'loans/SET_BORROW_NFTS',
  ADD_HIDDEN_BORROW_NFT: 'loans/ADD_HIDDEN_BORROW_NFT',
};

export const loansActions = {
  setLoans: createCustomAction(loansTypes.SET_LOANS, (loans: any) => ({
    payload: loans,
  })),
  setLending: createCustomAction(
    loansTypes.SET_LENDINGS,
    (lendings: LiquidityPoolsState) => ({
      payload: lendings,
    }),
  ),
  setBorrowNfts: createCustomAction(
    loansTypes.SET_BORROW_NFTS,
    (nfts: BorrowNft[]) => ({ payload: nfts }),
  ),
  addHiddenBorrowNftMint: createCustomAction(
    loansTypes.ADD_HIDDEN_BORROW_NFT,
    (mint: string) => ({ payload: mint }),
  ),
};
