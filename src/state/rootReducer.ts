import { combineReducers } from 'redux';

import commonReducers from './common/reducers';

const rootReducers = combineReducers({
  common: commonReducers,
});

export default rootReducers;
