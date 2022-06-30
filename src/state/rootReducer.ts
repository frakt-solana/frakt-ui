import { combineReducers } from 'redux';

import commonReducers from './common/reducers';
import tokenListReducers from './tokenList/reducers';
import userTokensReducers from './userTokens/reducers';
import loansReducers from './loans/reducers';
import liquidationsReducer from './liquidations/reducers';
import fetchPrismReducer from './prism/reducers';
import fetchStatsReducer from './stats/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
  tokenList: tokenListReducers,
  userTokens: userTokensReducers,
  loans: loansReducers,
  liquidations: liquidationsReducer,
  prism: fetchPrismReducer,
  stats: fetchStatsReducer,
});

export default rootReducers;
