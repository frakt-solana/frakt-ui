import { FC } from 'react';
import classNames from 'classnames';

import { Loader } from '../Loader';
import { Modal } from '../Modal';
import styles from './LoadingModal.module.scss';

interface LoadingModalProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  onCancel?: () => void;
  loaderSize?: 'large' | 'default' | 'small';
  className?: string;
}

export const LoadingModal: FC<LoadingModalProps> = ({
  visible,
  title = 'Please approve all transactions',
  subtitle = '',
  onCancel,
  loaderSize = 'large',
  className,
}) => {
  return (
    <Modal
      visible={visible}
      style={modalPosition}
      closable={!!onCancel}
      maskClosable={false}
      width={560}
      onCancel={onCancel}
      className={classNames(styles.modal, className)}
    >
      <div className={styles.content}>
        <Loader size={loaderSize} />
        <span className={styles.infoTitle}>{title}</span>
        <span className={styles.infoSubtitle}>{subtitle}</span>
      </div>
    </Modal>
  );
};

const modalPosition = {
  top: '100%',
  right: 0,
  paddingTop: 16,
  paddingBottom: 16,
  paddingRight: 16,
  paddingLeft: 16,
  margin: 0,
  marginLeft: 'auto',
  maxWidth: '100%',
  maxHeight: '100%',
  transform: 'translateY(-100%)',
};
