import { createActions } from '../../utils/state/actions';

const namespace = 'common';

const [appInitType, appInitAction] = createActions('APP_INIT', namespace);
const [setNotificationType, setNotificationAction] = createActions(
  'SET_NOTIFICATION',
  namespace,
);
const [fetchSolanaHealthTypes, fetchSolanaHealthActions] = createActions(
  'FETCH_SOLANA_HEALTH',
  namespace,
  true,
);

export const commonTypes = {
  ...appInitType,
  ...setNotificationType,
  ...fetchSolanaHealthTypes,
};

export const commonActions = {
  ...appInitAction,
  ...setNotificationAction,
  ...fetchSolanaHealthActions,
};
