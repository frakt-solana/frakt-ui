import { useDispatch, useSelector } from 'react-redux';
import { commonActions } from './../state/common/actions';
import { useEffect } from 'react';

import { selectSolanaTimestamp } from '../state/common/selectors';

type UseSolanaTimestamp = () => number | null;

export const useSolanaTimestamp: UseSolanaTimestamp = () => {
  const dispatch = useDispatch();
  const solanaTimestamp = useSelector(selectSolanaTimestamp);

  useEffect(() => {
    dispatch(commonActions.fetchSolanaTimestamp());
  }, [dispatch]);

  return solanaTimestamp;
};
