import { useContext } from 'react';

import { NftPoolsContext } from './nftPools.context';
import { NftPoolsContextValues } from './nftPools.model';

export const useNftPools = (): NftPoolsContextValues => {
  const context = useContext(NftPoolsContext);
  return context;
};
