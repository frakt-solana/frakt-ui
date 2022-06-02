import { FC } from 'react';
import { useDispatch } from 'react-redux';

import Button from '../../../../../components/Button';
import { commonActions } from '../../../../../state/common/actions';
import styles from './PoolDetailsWalletDisconnected.module.scss';

interface PoolDetailsWalletDisconnectedProps {
  className?: string;
}

export const PoolDetailsWalletDisconnected: FC<PoolDetailsWalletDisconnectedProps> =
  ({ className }) => {
    const dispatch = useDispatch();
    return (
      <div className={className}>
        <Button
          onClick={() =>
            dispatch(commonActions.setWalletModal({ isVisible: true }))
          }
          className={styles.connectBtn}
        >
          Connect wallet
        </Button>
      </div>
    );
  };
