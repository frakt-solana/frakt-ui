import { combineReducers } from 'redux';

import commonReducers from './common/reducers';
import tokenListReducers from './tokenList/reducers';
import userTokensReducers from './userTokens/reducers';
import loansReducers from './loans/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
  tokenList: tokenListReducers,
  userTokens: userTokensReducers,
  loans: loansReducers,
});

export default rootReducers;
