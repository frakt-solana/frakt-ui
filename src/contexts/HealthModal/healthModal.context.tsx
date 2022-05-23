import React, { FC, useState, useEffect } from 'react';
import { cond, propEq, always, T } from 'ramda';

import { LinkWithArrow } from '../../components/LinkWithArrow';
import {
  HealthModalContextValues,
  HealthModalProviderProps,
} from './healthModal.model';
import { useHealth, SolanaNetworkHealth } from '../../utils/health';

export const HealthModalContext = React.createContext<HealthModalContextValues>(
  {
    visible: false,
    setVisible: () => {},
    config: null,
  },
);

export const HealthModalProvider: FC<HealthModalProviderProps> = ({
  children,
}) => {
  const health = useHealth();
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    setConfig(
      cond([
        [
          propEq('health', SolanaNetworkHealth.Down),
          always({
            mode: 'error',
            content: (
              <div>
                🤕 Solana feels <span style={{ fontWeight: 600 }}>really</span>{' '}
                bad at the moment. We strongly recommend not to make any
                transactions at the moment.{' '}
                <LinkWithArrow
                  to="https://explorer.solana.com/"
                  label="Check Solana health here"
                  externalLink
                  invert
                />
              </div>
            ),
          }),
        ],
        [
          propEq('health', SolanaNetworkHealth.Slow),
          always({
            mode: 'warning',
            content: (
              <div>
                🤒 Your on-chain actions have an increased chance of failing.{' '}
                <LinkWithArrow
                  to="https://explorer.solana.com/"
                  label="Check Solana health here"
                  externalLink
                  invert
                />
              </div>
            ),
          }),
        ],
        [T, always(null)],
      ])(health),
    );
  }, [health]);

  useEffect(() => {
    setVisible(!!config);
  }, [config]);

  return (
    <HealthModalContext.Provider
      value={{
        visible,
        setVisible,
        config,
      }}
    >
      {children}
    </HealthModalContext.Provider>
  );
};
