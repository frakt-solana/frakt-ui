import { useDispatch } from 'react-redux';

import { commonActions } from '../../state/common/actions';
import styles from './styles.module.scss';
import Button from '../Button';
import { useWallet } from '@solana/wallet-adapter-react';
import { shortenAddress } from '../../utils/solanaUtils';
import { ArrowDownBtn } from '../../icons';

export interface ConnectButtonProps {
  className?: string;
}

const ConnectedButton = ({ className }: ConnectButtonProps): JSX.Element => {
  const dispatch = useDispatch();
  const { publicKey: walletPubKey } = useWallet();

  return (
    <Button
      className={className}
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      {shortenAddress(walletPubKey.toString())}
      <ArrowDownBtn className={styles.arrowDownIcon} />
    </Button>
  );
};

export default ConnectedButton;
