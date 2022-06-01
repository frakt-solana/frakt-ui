import { Connection } from '@solana/web3.js';
import { useSelector } from 'react-redux';

import { selectConnection } from '../state/common/selectors';

export const useConnection = (): Connection | null => {
  const connection = useSelector(selectConnection);

  return connection;
};
