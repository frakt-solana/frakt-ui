import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { routes } from './constants/routes';
import {
  useConnectionInit,
  useAppInit,
  useHealthNotification,
  useFirebaseNotifications,
  useWebSocketSubscriptions,
} from './hooks';

export const Router = (): JSX.Element => {
  useAppInit();
  useHealthNotification();
  useConnectionInit();
  useFirebaseNotifications();
  useWebSocketSubscriptions();

  return (
    <BrowserRouter>
      <Switch>
        {routes.map(({ exact, path, component: Component }, index) => (
          <Route
            key={index}
            exact={exact}
            path={path}
            component={() => <Component />}
          />
        ))}
      </Switch>
    </BrowserRouter>
  );
};
