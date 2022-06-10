import { createCustomAction } from 'typesafe-actions';

export const loansTypes = {
  SET_LOANS: 'loans/SET_LOANS',
  SET_LENDING: 'loans/SET_LENDING',
};

export const loansActions = {
  setLoans: createCustomAction(loansTypes.SET_LOANS, (loans: any) => ({
    payload: loans,
  })),
  setLending: createCustomAction(loansTypes.SET_LENDING, (lending: any) => ({
    payload: lending,
  })),
};
