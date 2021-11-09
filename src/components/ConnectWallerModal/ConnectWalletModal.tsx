import styles from './styles.module.scss';
import { Modal, ModalProps } from '../Modal/Modal';
import { useWallet, WALLET_PROVIDERS } from '../../external/contexts/wallet';
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
  const { setProviderUrl, setAutoConnect, closeModal, isModalVisible } =
    useWallet();

  return (
    <Modal
      visible={isModalVisible}
      title={title || 'Connect wallet'}
      onCancel={closeModal}
      {...props}
    >
      <p className={styles.text}>
        Connect with one of available wallet providers or create a new wallet.
      </p>
      {WALLET_PROVIDERS.map(({ url, name }, idx) => {
        const Img = CUSTOM_WALLET_IMAGES[name];
        return (
          <div
            key={idx}
            className={styles.wallet}
            onClick={() => {
              setProviderUrl(url);
              setAutoConnect(true);
              closeModal();
            }}
          >
            <div className={styles.walletName}>
              <Img />
              <span>{name}</span>
            </div>
            <ArrowRightIcon fill="white" />
          </div>
        );
      })}
    </Modal>
  );
};
