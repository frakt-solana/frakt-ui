import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { TokenInfo } from '@solana/spl-token-registry';
import { ControlledToggle } from '../Toggle/Toggle';
import RefreshIcon from '../../icons/refreshIcon';
import CustomCheckbox from '../CustomCheckbox';
import NumericInput from '../NumericInput';
import styles from './styles.module.scss';
import { Modal } from '../Modal';
import Tooltip from '../Tooltip';
import Button from '../Button';

interface DepositModalProps {
  visible: boolean;
  onCancel: () => void;
  baseToken: TokenInfo;
  quoteToken: TokenInfo;
}

const DepositModal: FC<DepositModalProps> = ({
  visible,
  onCancel,
  quoteToken,
  baseToken,
}) => {
  const { control } = useForm({ defaultValues: { autoSwap: false } });

  const [totalValue, setTotalValue] = useState<string>('');
  const [baseValue, setBaseValue] = useState<string>('');
  const [quoteValue, setQuoteValue] = useState<string>('');

  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      title="Deposit Liquidity"
      width={500}
      className={styles.modal}
    >
      <div className={styles.container}>
        <div className={styles.swap}>
          <ControlledToggle
            control={control}
            name="autoSwap"
            className={styles.filter}
          />
          <p>Auto-swap uneven amounts</p>
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
        <div className={styles.inputWrapper}>
          <div className={styles.token}>
            <img src={baseToken.logoURI} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{baseToken.symbol}</p>
          </div>
          <NumericInput
            className={styles.input}
            value={baseValue}
            onChange={setBaseValue}
          />
        </div>
        <div className={styles.inputWrapper}>
          <div className={styles.token}>
            <img src={quoteToken.logoURI} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{quoteToken.symbol}</p>
          </div>
          <NumericInput
            className={styles.input}
            value={quoteValue}
            onChange={setQuoteValue}
          />
        </div>
        <div className={styles.totalLine}>
          <p className={styles.title}>Total</p>
          <div className={styles.line} />
        </div>
        <div className={styles.totalInputWrapper}>
          <NumericInput
            className={styles.input}
            value={totalValue}
            onChange={setTotalValue}
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
          <CustomCheckbox />
          <p className={styles.text}>
            I verify that I have read the{' '}
            <a href="#" target="_blank" rel="noopener noreferrer">
              Fraktion Pools Guide
            </a>{' '}
            and understand the risks of providing liquidity, including
            impermanent loss.
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
