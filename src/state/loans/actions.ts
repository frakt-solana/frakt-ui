import { createCustomAction } from 'typesafe-actions';

import { BorrowNft, LiquidityPool, Loan } from './types';

export const loansTypes = {
  SET_LOANS: 'loans/SET_LOANS',
  SET_LIQUIDITY_POOLS: 'loans/SET_LIQUIDITY_POOLS',
  SET_BORROW_NFTS: 'loans/SET_BORROW_NFTS',
  ADD_HIDDEN_BORROW_NFT: 'loans/ADD_HIDDEN_BORROW_NFT',
  ADD_HIDDEN_LOAN_NFT: 'loans/ADD_HIDDEN_LOAN_NFT',
};

export const loansActions = {
  setLoans: createCustomAction(loansTypes.SET_LOANS, (loans: Loan[]) => ({
    payload: loans,
  })),
  setLiquidityPools: createCustomAction(
    loansTypes.SET_LIQUIDITY_POOLS,
    (liquidityPools: LiquidityPool[]) => ({
      payload: liquidityPools,
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
  addHiddenLoanNftMint: createCustomAction(
    loansTypes.ADD_HIDDEN_LOAN_NFT,
    (mint: string) => ({ payload: mint }),
  ),
};
