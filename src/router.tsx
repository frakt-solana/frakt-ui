import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { routes } from './constants/routes';

export const Router = (): JSX.Element => {
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
