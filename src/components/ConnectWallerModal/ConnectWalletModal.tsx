import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';

import { selectWalletModalVisible } from '../../state/common/selectors';
import { commonActions } from '../../state/common/actions';
import styles from './styles.module.scss';
import { Modal, ModalProps } from '../Modal/Modal';
import { ArrowRightIcon } from '../../icons';

export const ConnectWalletModal = ({
  title,
  ...props
}: ModalProps): JSX.Element => {
  const { wallets, select } = useWallet();
  const dispatch = useDispatch();
  const visible = useSelector(selectWalletModalVisible);

  return (
    <Modal
      visible={visible}
      title={title || 'Connect wallet'}
      onCancel={() =>
        dispatch(commonActions.setWalletModal({ isVisible: false }))
      }
      {...props}
    >
      <p className={styles.text}>
        Connect with one of available wallet providers or create a new wallet.
      </p>
      {wallets.map(({ adapter }, idx) => {
        return (
          <div
            key={idx}
            className={styles.wallet}
            onClick={() => {
              select(adapter.name);
              dispatch(commonActions.setWalletModal({ isVisible: false }));
            }}
          >
            <div className={styles.walletName}>
              <img src={adapter.icon} alt="Wallet icon" />
              <span>{adapter.name}</span>
            </div>
            <ArrowRightIcon fill="white" />
          </div>
        );
      })}
    </Modal>
  );
};
