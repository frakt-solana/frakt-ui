import styles from './styles.module.scss';
import { Modal, ModalProps } from '../Modal/Modal';
import { useWallet, WALLET_PROVIDERS } from '../../external';
import { ArrowRightIcon } from '../../icons';

export const ConnectWalletModal = ({
  title,
  ...props
}: ModalProps): JSX.Element => {
  const {
    setProviderUrl,
    setAutoConnect,
    closeSelectModal,
    isSelectModalVisible,
  } = useWallet();

  return (
    <Modal
      visible={isSelectModalVisible}
      title={title || 'Connect wallet'}
      onCancel={closeSelectModal}
      {...props}
    >
      <p className={styles.text}>
        Connect with one of available wallet providers or create a new wallet.
      </p>
      {WALLET_PROVIDERS.map(({ url, name, icon }, idx) => {
        return (
          <div
            key={idx}
            className={styles.wallet}
            onClick={() => {
              setProviderUrl(url);
              setAutoConnect(true);
              closeSelectModal();
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
