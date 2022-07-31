import { combineReducers } from 'redux';

import commonReducers from './common/reducers';
import tokenListReducers from './tokenList/reducers';
import loansReducers from './loans/reducers';
import liquidationsReducer from './liquidations/reducers';
import fetchStatsReducer from './stats/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
  tokenList: tokenListReducers,
  loans: loansReducers,
  liquidations: liquidationsReducer,
  stats: fetchStatsReducer,
});

export default rootReducers;
