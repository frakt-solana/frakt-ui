import { FC } from 'react';
import { useDispatch } from 'react-redux';

import styles from './WalletNotConnected.module.scss';
import Button from '../../../../components/Button';
import { commonActions } from '../../../../state/common/actions';

interface WalletNotConnectedProps {
  className?: string;
  type: 'sell' | 'swap';
}

export const WalletNotConnected: FC<WalletNotConnectedProps> = ({
  className,
  type,
}) => {
  const dispatch = useDispatch();

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <p className={styles.text}>
        Connect your wallet to check if you have any suitable NFTs to {type}.
      </p>
      <Button
        type="alternative"
        className={styles.connectButton}
        onClick={() =>
          dispatch(commonActions.setWalletModal({ isVisible: true }))
        }
      >
        Connect wallet
      </Button>
    </div>
  );
};
