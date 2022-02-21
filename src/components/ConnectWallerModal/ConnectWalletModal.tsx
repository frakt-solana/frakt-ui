import { useWallet } from '@solana/wallet-adapter-react';

import styles from './styles.module.scss';
import { Modal, ModalProps } from '../Modal/Modal';
import { ArrowRightIcon } from '../../icons';
import { useWalletModal } from '../../contexts/WalletModal';

export const ConnectWalletModal = ({
  title,
  ...props
}: ModalProps): JSX.Element => {
  const { wallets, select } = useWallet();
  const { visible, setVisible } = useWalletModal();

  return (
    <Modal
      visible={visible}
      title={title || 'Connect wallet'}
      onCancel={() => setVisible(false)}
      {...props}
    >
      <p className={styles.text}>
        Connect with one of available wallet providers or create a new wallet.
      </p>
      {wallets.map(({ name, icon }, idx) => {
        return (
          <div
            key={idx}
            className={styles.wallet}
            onClick={() => {
              select(name);
              setVisible(false);
            }}
          >
            <div className={styles.walletName}>
              <img src={icon} alt="Wallet icon" />
              <span>{name}</span>
            </div>
            <ArrowRightIcon fill="white" />
          </div>
        );
      })}
    </Modal>
  );
};
