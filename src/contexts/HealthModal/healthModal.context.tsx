import React, { FC, useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cond, propEq, always, T } from 'ramda';
import {
  HealthModalContextInterface,
  HealthModalProviderProps,
} from './healthModal.model';
import { useHealth } from '../../utils/health/health.hooks';
import { SolanaNetworkHealth } from '../../utils/health/health.model';

export const HealthModalContext =
  React.createContext<HealthModalContextInterface>({
    visible: false,
    setVisible: () => {},
    config: null,
  });

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
                Solana feels really bad at the moment. We strongly recommend not
                to make any transactions at the moment.{' '}
                <Link
                  to={{ pathname: 'https://explorer.solana.com/' }}
                  target="_blank"
                >
                  Check Solana health
                </Link>
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
                Solana feels bad at the moment. Your transactions may fail with
                a high probability.{' '}
                <Link
                  to={{ pathname: 'https://explorer.solana.com/' }}
                  target="_blank"
                >
                  Check Solana health
                </Link>
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

export const useHealthModal = (): HealthModalContextInterface => {
  const { setVisible, visible, config } = useContext(HealthModalContext);

  return { setVisible, visible, config };
};
