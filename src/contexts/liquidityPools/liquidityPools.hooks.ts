import { useContext } from 'react';
import { LiquidityPoolsContext } from './liquidityPools.context';
import { LiquidityPoolsContextValues } from './liquidityPools.model';

export const useLiquidityPools = (): LiquidityPoolsContextValues => {
  const context = useContext(LiquidityPoolsContext);
  if (context === null) {
    throw new Error('TokenListContext not available');
  }
  return context;
};
