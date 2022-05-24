import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Form } from 'antd';

import { InputControlsNames, TabsNames, usePoolModal } from './usePoolModal';
import { SOL_TOKEN, getSolBalanceValue } from '../../utils';
import { useNativeAccount } from '../../utils/accounts';
import { TokenFieldWithBalance } from '../TokenField';
import { CloseModalIcon } from '../../icons';
import styles from './PoolModal.module.scss';
import { Modal } from '../Modal';
import Slider from '../Slider';
import Button from '../Button';
import { Tabs } from '../Tabs';

interface PoolModalProps {
  visible: string;
  onCancel: () => void;
  apr?: number;
  userDeposit?: number;
  utilizationRate?: number;
}

export const PoolModal: FC<PoolModalProps> = ({
  visible,
  onCancel,
  apr,
  userDeposit,
  utilizationRate,
}) => {
  const {
    formControl,
    depositValue,
    withdrawValue,
    depositLiquidity,
    unstakeLiquidity,
    poolTabs,
    tabValue,
    setTabValue,
  } = usePoolModal(visible);

  const { account } = useNativeAccount();
  const solWalletBalance = getSolBalanceValue(account);

  return (
    <Modal
      visible={!!visible}
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
                  label={`Wallet balance: ${solWalletBalance} SOL`}
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
                  tipFormatter={(value) => `${value} SOL`}
                  onChange={onChange}
                  className={styles.slider}
                  step={0.1}
                  max={Number(solWalletBalance)}
                />
              )}
            />
          </Form.Item>
          <div className={styles.info}>
            <span className={styles.infoTitle}>Deposit APR</span>
            <span className={styles.infoValue}>{apr.toFixed(2)}%</span>
          </div>
          <div className={styles.info}>
            <span className={styles.infoTitle}>Utilization</span>
            <span className={styles.infoValue}>
              {utilizationRate.toFixed(2)}%
            </span>
          </div>
          <Button
            onClick={depositLiquidity}
            className={styles.btn}
            type="alternative"
          >
            Deposit
          </Button>
        </>
      )}
      {tabValue === TabsNames.WITHDRAW && (
        <>
          <Form.Item name={InputControlsNames.WITHDRAW_VALUE}>
            <Controller
              control={formControl}
              name={InputControlsNames.WITHDRAW_VALUE}
              render={({ field: { onChange } }) => (
                <TokenFieldWithBalance
                  className={styles.input}
                  value={String(withdrawValue)}
                  onValueChange={onChange}
                  currentToken={SOL_TOKEN}
                  label={`Your deposit: ${userDeposit} SOL`}
                />
              )}
            />
          </Form.Item>
          <Form.Item name={InputControlsNames.WITHDRAW_VALUE}>
            <Controller
              control={formControl}
              name={InputControlsNames.WITHDRAW_VALUE}
              rules={{ required: true }}
              render={({ field: { onChange } }) => (
                <Slider
                  value={withdrawValue}
                  tipFormatter={(value) => `${value} SOL`}
                  onChange={onChange}
                  className={styles.slider}
                  step={0.1}
                  max={userDeposit}
                />
              )}
            />
          </Form.Item>
          <Button
            onClick={unstakeLiquidity}
            className={styles.btn}
            type="alternative"
          >
            Confirm
          </Button>
        </>
      )}
    </Modal>
  );
};
