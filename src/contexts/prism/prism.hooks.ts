import { useContext } from 'react';
import { PrismContextValues } from '.';
import { PrismContext } from './prism.context';

export const usePrism = (): PrismContextValues => {
  const context = useContext(PrismContext);
  if (context === null) {
    throw new Error('PrismContext not available');
  }
  return context;
};
