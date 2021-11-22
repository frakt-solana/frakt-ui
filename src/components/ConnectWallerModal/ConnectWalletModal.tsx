import styles from './styles.module.scss';
import { Modal, ModalProps } from '../Modal/Modal';
import { useWallet, WALLET_PROVIDERS } from '../../external/contexts/Wallet';
import {
  PhantomIcon,
  SolletIcon,
  SolfareIcon,
  ArrowRightIcon,
} from '../../icons';

const CUSTOM_WALLET_IMAGES = {
  Phantom: PhantomIcon,
  Solflare: SolletIcon,
  Sollet: SolfareIcon,
};

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
        const Img = CUSTOM_WALLET_IMAGES[name];
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
              {Img ? <Img /> : <img src={icon} alt="Wallet icon" />}
              <span>{name}</span>
            </div>
            <ArrowRightIcon fill="white" />
          </div>
        );
      })}
    </Modal>
  );
};
