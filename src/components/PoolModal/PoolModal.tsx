import { FC } from 'react';

import { marks, TabsNames, usePoolModal } from './usePoolModal';
import { TokenFieldWithBalance } from '../TokenField';
import { CloseModalIcon } from '../../icons';
import styles from './PoolModal.module.scss';
import { SOL_TOKEN } from '../../utils';
import { Slider } from '../Slider';
import { Modal } from '../Modal';
import Button from '../Button';
import { Tabs } from '../Tabs';

interface PoolModalProps {
  visible: string;
  onCancel: () => void;
  apr: number;
  depositAmount: number;
  utilizationRate: number;
}

export const PoolModal: FC<PoolModalProps> = ({
  visible,
  onCancel,
  apr,
  depositAmount,
  utilizationRate,
}) => {
  const {
    withdrawValue,
    depositValue,
    depositLiquidity,
    unstakeLiquidity,
    poolTabs,
    tabValue,
    setTabValue,
    percentValue,
    onDepositValueChange,
    onDepositPercentChange,
    onWithdrawValueChange,
    onWithdrawPercentChange,
    solWalletBalance,
  } = usePoolModal(visible, depositAmount, onCancel);

  const notEnoughDepositError = depositAmount < Number(withdrawValue);
  const notEnoughBalanceError = Number(solWalletBalance) < Number(depositValue);
  const isDisabledDepositBtn =
    Number(depositValue) === 0 || notEnoughBalanceError;
  const isDisabledWithdrawBtn =
    Number(withdrawValue) === 0 || notEnoughDepositError;

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
          <TokenFieldWithBalance
            className={styles.input}
            value={depositValue}
            onValueChange={onDepositValueChange}
            currentToken={SOL_TOKEN}
            label={`BALANCE: ${solWalletBalance || 0} SOL`}
            lpBalance={Number(solWalletBalance)}
            error={notEnoughBalanceError}
            showMaxButton
            labelRight
          />
          <div className={styles.errors}>
            {notEnoughBalanceError && <p>Not enough SOL</p>}
          </div>
          <Slider
            value={percentValue}
            setValue={solWalletBalance && onDepositPercentChange}
            className={styles.slider}
            marks={marks}
            withTooltip
            step={1}
          />
          <div className={styles.info}>
            <span className={styles.infoTitle}>Deposit APR</span>
            <span className={styles.infoValue}>{apr.toFixed(2)}%</span>
          </div>
          <div className={styles.info}>
            <span className={styles.infoTitle}>Utilization rate</span>
            <span className={styles.infoValue}>
              {utilizationRate.toFixed(2)}%
            </span>
          </div>
          <Button
            onClick={depositLiquidity}
            className={styles.btn}
            type="alternative"
            disabled={isDisabledDepositBtn}
          >
            Deposit
          </Button>
        </>
      )}
      {tabValue === TabsNames.WITHDRAW && (
        <>
          <TokenFieldWithBalance
            value={withdrawValue}
            onValueChange={onWithdrawValueChange}
            currentToken={SOL_TOKEN}
            label={`Your deposit: ${depositAmount} SOL`}
            lpBalance={depositAmount}
            error={notEnoughDepositError}
            className={styles.input}
            showMaxButton
            labelRight
          />
          <div className={styles.errors}>
            {notEnoughDepositError && <p>Not enough SOL</p>}
          </div>
          <Slider
            value={percentValue}
            setValue={depositAmount && onWithdrawPercentChange}
            className={styles.slider}
            marks={marks}
            withTooltip
            step={5}
          />

          <Button
            onClick={unstakeLiquidity}
            className={styles.btn}
            type="alternative"
            disabled={isDisabledWithdrawBtn}
          >
            Confirm
          </Button>
        </>
      )}
    </Modal>
  );
};
