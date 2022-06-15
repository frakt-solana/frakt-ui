import * as Sentry from '@sentry/browser';
import * as ReactSentry from '@sentry/react';
import { RouterHistory } from '@sentry/react/types/reactrouter';
import { Integrations } from '@sentry/tracing';
import { SENTRY_APP_DSN } from './constants';

export const initSentry = (history: RouterHistory): void => {
  Sentry.init({
    dsn: SENTRY_APP_DSN,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation:
          ReactSentry.reactRouterV5Instrumentation(history),
      }),
    ],

    tracesSampleRate: 1.0,
  });
};

export const captureSentryError = ({
  error,
  user,
  transactionName,
}: {
  error: Error;
  user?: string;
  transactionName: string;
}): void => {
  if (user) {
    Sentry.setUser({ user });
  } else {
    Sentry.setUser(null);
  }

  Sentry.configureScope((scope) => scope.setTransactionName(transactionName));
  Sentry.captureException(error);

  // eslint-disable-next-line no-console
  console.error(error);
};
