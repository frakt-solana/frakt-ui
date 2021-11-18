import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.dark.css';
import './scss/styles.scss';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import * as serviceWorker from './serviceWorker';
import Error from './components/Error';

Sentry.init({
  dsn: 'https://8306780456f14d6fab68615d073ca51b@o1071528.ingest.sentry.io/6069014',
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <Sentry.ErrorBoundary fallback={Error}>
    <App />
  </Sentry.ErrorBoundary>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
