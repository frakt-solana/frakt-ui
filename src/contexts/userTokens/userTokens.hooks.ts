import { useContext } from 'react';

import { UserTokensContext } from './userTokens.context';
import { UserTokensValues } from './userTokens.model';

export const useUserTokens = (): UserTokensValues => {
  const context = useContext(UserTokensContext);

  return context;
};
