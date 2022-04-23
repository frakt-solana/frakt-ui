import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Form } from 'antd';

import { InputControlsNames, TabsNames, usePoolModal } from './usePoolModal';
import { TokenFieldWithBalance } from '../TokenField';
import { CloseModalIcon } from '../../icons';
import styles from './PoolModal.module.scss';
import { SOL_TOKEN } from '../../utils';
import { Tabs, useTabs } from '../Tabs';
import { Modal } from '../Modal';
import Slider from '../Slider';
import Button from '../Button';

interface PoolModalProps {
  visible: boolean;
  setVisible?: (visible: boolean) => void;
  onCancel: () => void;
}

export const PoolModal: FC<PoolModalProps> = ({ visible, onCancel }) => {
  const {
    tabs: poolTabs,
    value: tabValue,
    setValue: setTabValue,
  } = useTabs({
    tabs: POOLS_TABS,
    defaultValue: POOLS_TABS[0].value,
  });

  const { formControl, depositValue } = usePoolModal();

  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      width={500}
      footer={false}
      closable={false}
      className={styles.modal}
    >
      <div className={styles.closeModalSection}>
        <div className={styles.closeModalIcon} onClick={onCancel}>
          <CloseModalIcon className={styles.closeIcon} />
        </div>
      </div>
      <Tabs
        className={styles.tabs}
        tabs={poolTabs}
        value={tabValue}
        setValue={setTabValue}
      />
      {tabValue === TabsNames.DEPOSIT && (
        <>
          <Form.Item name={InputControlsNames.DEPOSIT_VALUE}>
            <Controller
              control={formControl}
              name={InputControlsNames.DEPOSIT_VALUE}
              render={({ field: { onChange } }) => (
                <TokenFieldWithBalance
                  className={styles.input}
                  value={String(depositValue)}
                  onValueChange={onChange}
                  currentToken={SOL_TOKEN}
                  label="Your deposit: 250 SOL ≈ $ 25.000"
                />
              )}
            />
          </Form.Item>
          <Form.Item name={InputControlsNames.DEPOSIT_VALUE}>
            <Controller
              control={formControl}
              name={InputControlsNames.DEPOSIT_VALUE}
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <Slider
                  value={depositValue}
                  tipFormatter={(value) => `${value}%`}
                  onChange={onChange}
                  className={styles.slider}
                  step={1}
                  max={100}
                />
              )}
            />
          </Form.Item>
          <div className={styles.info}>
            <span className={styles.infoTitle}>Reserve deposit limit</span>
            <span className={styles.infoValue}>2.000 SOL</span>
          </div>
          <div className={styles.info}>
            <span className={styles.infoTitle}>User borrow limit</span>
            <span className={styles.infoValue}>$ 200.000</span>
          </div>
          <div className={styles.info}>
            <span className={styles.infoTitle}>Deposit APY</span>
            <span className={styles.infoValue}>50%</span>
          </div>
          <div className={styles.info}>
            <span className={styles.infoTitle}>Utilization</span>
            <span className={styles.infoValue}>50%</span>
          </div>
          <Button type="alternative" className={styles.btn}>
            Deposit
          </Button>
        </>
      )}
      {tabValue === TabsNames.WITHDRAW && (
        <>
          <Form.Item name={InputControlsNames.DEPOSIT_VALUE}>
            <Controller
              control={formControl}
              name={InputControlsNames.DEPOSIT_VALUE}
              render={({ field: { onChange } }) => (
                <TokenFieldWithBalance
                  className={styles.input}
                  value={String(depositValue)}
                  onValueChange={onChange}
                  currentToken={SOL_TOKEN}
                  label="Your deposit: 250 SOL ≈ $ 25.000"
                />
              )}
            />
          </Form.Item>
          <Form.Item name={InputControlsNames.DEPOSIT_VALUE}>
            <Controller
              control={formControl}
              name={InputControlsNames.DEPOSIT_VALUE}
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <Slider
                  value={depositValue}
                  tipFormatter={(value) => `${value}%`}
                  onChange={onChange}
                  className={styles.slider}
                  step={1}
                  max={100}
                />
              )}
            />
          </Form.Item>
          <Button type="alternative" className={styles.btn}>
            Confirm
          </Button>
        </>
      )}
    </Modal>
  );
};

const POOLS_TABS = [
  {
    label: 'Deposit',
    value: 'deposit',
  },
  {
    label: 'Withdraw',
    value: 'withdraw',
  },
];
