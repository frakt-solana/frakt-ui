import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { POOLS, POOL_TABS } from './constants';
import { routes } from './constants/routes';
import { useNotification } from './hooks/useNotification';
import { useAppInit } from './hooks/useAppInit';

export const Router = (): JSX.Element => {
  useAppInit();
  useNotification();

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
