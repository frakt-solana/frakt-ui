import { FC, useState } from 'react';
import Button from '../../../../components/Button';

import { Modal } from '../../../../components/Modal';
import { Slider } from '../../../../components/Slider';
import { TokenAmountInputWithBalance } from '../../../../components/TokenAmountInputWithBalance';
import { CloseModalIcon } from '../../../../icons';
import { SOL_TOKEN } from '../../../../utils';
import styles from './PartialRepayModal.module.scss';

interface PartialRepayModalProps {
  visible: boolean;
  onCancel: () => void;
}

const SLIDER_MARKS = {
  0: '0%',
  25: '25%',
  50: '50%',
  75: '75%',
  100: '100%',
};

export const PartialRepayModal: FC<PartialRepayModalProps> = ({
  visible,
  onCancel,
}) => {
  const [percentValue, setPercentValue] = useState();

  const notEnoughBalanceError = true;

  return (
    <Modal
      visible={!!visible}
      centered
      onCancel={onCancel}
      width={500}
      destroyOnClose
      footer={false}
      closable={false}
    >
      <div className={styles.closeModal} onClick={onCancel}>
        <CloseModalIcon className={styles.closeIcon} />
      </div>

      {/* <TokenAmountInputWithBalance
        value={'1234.5678'}
        setValue={() => {}}
        tokenTicker={SOL_TOKEN.name}
        tokenImage={SOL_TOKEN.logoURI}
        balance="12345678.91"
        // customLabel="Debt"
        className={styles.input}
        error
      /> */}
      <div className={styles.errors}>
        {notEnoughBalanceError && <p>Not enough SOL</p>}
      </div>
      <Slider
        value={percentValue}
        setValue={(value) => value}
        className={styles.slider}
        marks={SLIDER_MARKS}
        step={1}
      />
      <div className={styles.info}>
        <span className={styles.infoTitle}>Repay value</span>
        <span className={styles.infoValue}>{2.5} SOL</span>
      </div>
      <div className={styles.info}>
        <span className={styles.infoTitle}>Remaining debt</span>
        <span className={styles.infoValue}>{2.5} SOL</span>
      </div>
      <Button
        onClick={() => {}}
        className={styles.repayBtn}
        type="alternative"
        // disabled={isDisabledWithdrawBtn}
      >
        Repay
      </Button>
    </Modal>
  );
};
