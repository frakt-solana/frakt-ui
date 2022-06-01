import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { LinkWithArrow } from '../components/LinkWithArrow';
import { selectSolanaHealth } from '../state/common/selectors';
import { commonActions } from '../state/common/actions';
import { SolanaNetworkHealth } from '../state/common/types';

export const useHealthNotification = (): void => {
  const dispatch = useDispatch();
  const SolanaHealth = useSelector(selectSolanaHealth);

  useEffect(() => {
    if (SolanaHealth.health === SolanaNetworkHealth.Down) {
      dispatch(
        commonActions.setNotification({
          config: {
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
          },
          isVisible: true,
        }),
      );
    } else if (SolanaHealth.health === SolanaNetworkHealth.Slow) {
      dispatch(
        commonActions.setNotification({
          config: {
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
          },
          isVisible: true,
        }),
      );
    }
  }, [dispatch, SolanaHealth]);
};
