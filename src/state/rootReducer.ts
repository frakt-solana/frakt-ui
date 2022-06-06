import { combineReducers } from 'redux';

import commonReducers from './common/reducers';
import tokenListReducers from './tokenList/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
  tokenList: tokenListReducers,
});

export default rootReducers;
