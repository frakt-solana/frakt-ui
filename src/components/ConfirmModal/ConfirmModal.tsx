import { FC } from 'react';

import styles from './styles.module.scss';
import { Modal } from '../Modal';
import Button from '../Button';

interface ConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  title?: string;
  subtitle: string;
  btnAgree?: string;
  btnCancel?: string;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  visible,
  onCancel,
  title = 'Please confirm',
  subtitle,
  onSubmit,
  btnAgree = 'I agree',
  btnCancel = 'Cancel',
}) => {
  return (
    <Modal
      className={styles.modal}
      visible={visible}
      closable={true}
      onCancel={onCancel}
      width={500}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.btnWrapper}>
          <Button className={styles.btn} type="alternative" onClick={onSubmit}>
            {btnAgree}
          </Button>
          <Button className={styles.btn} type="tertiary" onClick={onCancel}>
            {btnCancel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
