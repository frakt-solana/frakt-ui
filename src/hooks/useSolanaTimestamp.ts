import { useDispatch, useSelector } from 'react-redux';
import { commonActions } from './../state/common/actions';
import { useEffect, useState } from 'react';

import { selectSolanaTimestamp } from '../state/common/selectors';

type UseSolanaTimestamp = () => number | null;

export const useSolanaTimestamp: UseSolanaTimestamp = () => {
  const [solanaTimestamp, setSolanaTimestamp] = useState<number | null>(null);
  const dispatch = useDispatch();
  const solanaTimestampData = useSelector(selectSolanaTimestamp);

  useEffect(() => {
    dispatch(commonActions.fetchSolanaTimestamp());
  }, [dispatch]);

  useEffect(() => {
    if (solanaTimestampData) {
      setSolanaTimestamp(solanaTimestampData);
    }
  }, [solanaTimestampData]);

  return solanaTimestamp;
};
