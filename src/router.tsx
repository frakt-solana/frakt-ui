import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { POOLS, POOL_TABS } from './constants';
import { routes } from './constants/routes';
import { useHealthNotification } from './hooks/useHealthNotification';
import { useAppInit } from './hooks/useAppInit';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { commonActions } from './state/common/actions';

export const Router = (): JSX.Element => {
  useAppInit();
  useHealthNotification();
  const { connection } = useConnection();
  const dispatch = useDispatch();

  useEffect(() => {
    if (connection) {
      dispatch(commonActions.setConnection(connection));
    }
  }, [connection, dispatch]);

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
