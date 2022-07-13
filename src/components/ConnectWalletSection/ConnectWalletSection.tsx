import { useDispatch } from 'react-redux';

import Button from '../../components/Button';
import { commonActions } from '../../state/common/actions';
import styles from './styles.module.scss';

interface ConnectWalletSectionProps {
  text: string;
}

export const ConnectWalletSection = ({
  text,
}: ConnectWalletSectionProps): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <div className={styles.connectWallet}>
      <p className={styles.connectWalletText}>{text}</p>
      <Button
        type="alternative"
        className={styles.connectWalletBtn}
        onClick={() =>
          dispatch(commonActions.setWalletModal({ isVisible: true }))
        }
      >
        Connect wallet
      </Button>
    </div>
  );
};
