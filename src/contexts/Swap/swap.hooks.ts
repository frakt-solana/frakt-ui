import { useContext } from 'react';

import { SwapContext } from './swap.context';
import { SwapContextInterface } from './swap.model';

export const useSwapContext = (): SwapContextInterface => {
  const context = useContext(SwapContext);
  return context;
};
