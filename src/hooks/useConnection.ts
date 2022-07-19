import { web3 } from '@frakt-protocol/frakt-sdk';
import { useSelector } from 'react-redux';

import { selectConnection } from '../state/common/selectors';

export const useConnection = (): web3.Connection | null => {
  const connection = useSelector(selectConnection);

  return connection;
};
