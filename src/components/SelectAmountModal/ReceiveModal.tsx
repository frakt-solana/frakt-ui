import React from 'react';
import styles from './styles.module.scss';
import { Modal, ModalProps } from '../Modal/Modal';
import { Input } from '../Input';
import { SearchOutlined } from '@ant-design/icons';

export const ReceiveModal = ({ title, ...props }: ModalProps): JSX.Element => {
  return (
    <Modal visible title={title || 'Receive'} {...props}>
      <Input
        className={styles.input}
        size="large"
        placeholder="ETH"
        prefix={<SearchOutlined className={styles.search} />}
        {...props}
      />
      {[1, 2, 3, 4, 5].map((el, idx) => (
        <div key={idx} className={styles.row}>
          <div className={styles.title}>
            <div className={styles.icon} />{' '}
            <span className={styles.title}>ETH</span>
          </div>
          0.993020549647554908
        </div>
      ))}
    </Modal>
  );
};
