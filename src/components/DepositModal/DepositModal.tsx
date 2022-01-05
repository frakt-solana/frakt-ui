import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Checkbox } from 'antd';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { ControlledToggle } from '../Toggle/Toggle';
import NumericInput from '../NumericInput';
import { Modal } from '../Modal';
import Tooltip from '../Tooltip';
import Button from '../Button';
import styles from './styles.module.scss';
import RefreshIcon from '../../icons/refreshIcon';

interface DepositModalProps {
  visible: boolean;
  onCancel: () => void;
}

const DepositModal: FC<DepositModalProps> = ({ visible, onCancel }) => {
  const [toValue, setToValue] = useState<string>('');

  const { control } = useForm({ defaultValues: { autoSwap: false } });

  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      title="Deposit Liquidity"
      width={500}
    >
      <div className={styles.depositModal}>
        <div className={styles.swap}>
          <ControlledToggle
            control={control}
            name="autoSwap"
            label="Auto-swap uneven amounts"
            className={styles.filter}
          />
          <Tooltip
            overlayInnerStyle={{
              width: 262,
              fontSize: 10,
              fontWeight: 700,
            }}
            placement="bottom"
            trigger="hover"
            overlay="Liquidity must be deposited according to the ratio of tokens in the pool. Check this box to auto-swap your liquidity to that ratio before depositing (this will fail if the price moves more than your slippage tolerance). When you withdraw the liquidity, you will withdraw equal values of both tokens."
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </div>
        <div className={styles.swapInputWrapper}>
          <div className={styles.token}>
            <img className={styles.tokenIcon} />
            <p className={styles.tokenName}>SOL</p>
          </div>
          <NumericInput
            className={styles.input}
            value={toValue}
            onChange={setToValue}
          />
        </div>
        <div className={styles.swapInputWrapper}>
          <div className={styles.token}>
            <img className={styles.tokenIcon} />
            <p className={styles.tokenName}>FRKT</p>
          </div>
          <NumericInput
            className={styles.input}
            value={toValue}
            onChange={setToValue}
          />
        </div>
        <div className={styles.totalLine}>
          <p className={styles.title}>Total</p>
          <div className={styles.line}></div>
        </div>
        <div className={styles.totalInputWrapper}>
          <NumericInput
            className={styles.input}
            value={toValue}
            onChange={setToValue}
          />
        </div>
        <div className={styles.refresh}>
          <RefreshIcon className={styles.refreshIcon} />
          <p className={styles.subtitle}>Refreshing pool data every 10s...</p>
        </div>
        <p className={styles.subtitle}>Estimated earnings from fees (7d)</p>
        <div className={styles.depositContent}>
          <div className={styles.depositInfo}>
            <p className={styles.value}>
              $ 0.00 <span>/ month</span>
            </p>
            <p className={styles.value}>
              8.38 % <span>/ apr</span>
            </p>
          </div>
          <p className={styles.link}>After staking</p>
        </div>
        <div className={styles.verify}>
          <Checkbox />
          <p className={styles.text}>
            I verify that I have read the <a>Fraktion Pools Guide</a> and
            understand the risks of providing liquidity, including impermanent
            loss.
          </p>
        </div>
        <Button className={styles.depositBtn} type="alternative">
          Deposit
        </Button>
      </div>
    </Modal>
  );
};

export default DepositModal;
