import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { commonActions } from '../state/common/actions';

export const useAppInit = (): void => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(commonActions.appInit());
  }, [dispatch]);
};
