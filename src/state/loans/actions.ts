import { createCustomAction } from 'typesafe-actions';

export const loansTypes = {
  SET_LOANS: 'loans/SET_LOANS',
};

export const loansActions = {
  setLoans: createCustomAction(loansTypes.SET_LOANS, (loans: any) => ({
    payload: loans,
  })),
};
