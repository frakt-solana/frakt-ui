import { FC } from 'react';

import { TabsNames, usePoolModal } from './usePoolModal';
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
  } = usePoolModal(visible, userDeposit);

  const notEnoughDepositError = userDeposit < Number(withdrawValue);
  const notEnoughBalanceError = Number(solWalletBalance) < Number(depositValue);

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
            value={depositValue}
            onValueChange={onDepositValueChange}
            currentToken={SOL_TOKEN}
            tokensList={[SOL_TOKEN]}
            label={`Your deposit: ${userDeposit} SOL`}
            showMaxButton
            error={notEnoughBalanceError}
          />
          <div className={styles.errors}>
            {notEnoughBalanceError && (
              <p>Your balance: {solWalletBalance} SOL</p>
            )}
          </div>
          <Slider
            value={percentValue}
            setValue={solWalletBalance && onDepositPercentChange}
            className={styles.slider}
          />
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
            disabled={notEnoughBalanceError}
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
            label={`Your deposit: ${userDeposit} SOL`}
            lpBalance={userDeposit}
            error={notEnoughDepositError}
            showMaxButton
          />
          <div className={styles.errors}>
            {notEnoughDepositError && <p>Your balance: {userDeposit} SOL</p>}
          </div>
          <Slider
            value={percentValue}
            setValue={userDeposit && onWithdrawPercentChange}
            className={styles.slider}
          />

          <Button
            onClick={unstakeLiquidity}
            className={styles.btn}
            type="alternative"
            disabled={notEnoughDepositError}
          >
            Confirm
          </Button>
        </>
      )}
    </Modal>
  );
};
