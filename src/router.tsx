import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { POOLS, POOL_TABS } from './constants';
import { routes } from './constants/routes';
import { useConnectionInit, useAppInit, useHealthNotification } from './hooks';

export const Router = (): JSX.Element => {
  useAppInit();
  useHealthNotification();
  useConnectionInit();

  return (
    <BrowserRouter>
      <Switch>
        <Redirect
          from={`${POOLS}/:poolPubkey`}
          to={`${POOLS}/:poolPubkey/${POOL_TABS.BUY}`}
          exact
        />
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
