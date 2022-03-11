import { FC } from 'react';
import Button from '../Button';
import { Modal } from '../Modal';
import styles from './styles.module.scss';

interface ConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  nftName?: string;
  returnPeriod?: string;
  ltvPrice?: string;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
  visible,
  onCancel,
  nftName,
  returnPeriod,
  ltvPrice,
  onSubmit,
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
        <h2 className={styles.title}>Please confirm</h2>
        <p className={styles.subtitle}>
          You are about to use your {nftName} as collateral in {ltvPrice} SOL
          loan that you claim to return in {returnPeriod} days. Want to proceed?
        </p>
        <div className={styles.btnWrapper}>
          <Button className={styles.btn} type="alternative" onClick={onSubmit}>
            I agree
          </Button>
          <Button className={styles.btn} type="tertiary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
