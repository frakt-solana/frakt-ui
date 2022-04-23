import { useContext } from 'react';
import { LoansPoolsContext } from './loans.context';
import { LoansContextValues } from './loans.model';

export const useLoans = (): LoansContextValues => {
  const context = useContext(LoansPoolsContext);
  if (context === null) {
    throw new Error('LoansContext not available');
  }
  return context;
};
