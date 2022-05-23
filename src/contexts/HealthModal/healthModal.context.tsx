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
                🤕 Solana feels really bad at the moment. We strongly recommend
                not to make any transactions at the moment.{' '}
                <LinkWithArrow
                  to="https://explorer.solana.com/"
                  label="Check Solana health"
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
                🤒 Solana feels bad at the moment. Your transactions may fail
                with a high probability.{' '}
                <LinkWithArrow
                  to="https://explorer.solana.com/"
                  label="Check Solana health"
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
