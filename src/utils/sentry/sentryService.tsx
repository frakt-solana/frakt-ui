import * as Sentry from '@sentry/browser';
import * as ReactSentry from '@sentry/react';
import { WalletContextState } from '@solana/wallet-adapter-react';
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
  wallet,
  transactionName,
}: {
  error: Error;
  wallet?: WalletContextState;
  transactionName: string;
}): void => {
  const user = wallet?.publicKey?.toBase58();

  if (user) {
    Sentry.setUser({ user });
  } else {
    Sentry.setUser(null);
  }

  Sentry.configureScope((scope) => scope.setTransactionName(transactionName));
  Sentry.captureException(error);

  console.error(error);
};
