import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

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
import { SOL_TOKEN } from '../../utils';
import { useLazyPoolInfo } from '../SwapForm/hooks';
import { getOutputAmount } from '../SwapForm/helpers';
import { useWallet } from '@solana/wallet-adapter-react';
import { calculateTotalDeposit } from '../../contexts/liquidityPools';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { InputControlsNames, useHandleSwap } from './hooks';

interface DepositModalProps {
  visible: boolean;
  onCancel: () => void;
  quoteToken: TokenInfo;
  currentSolanaPriceUSD: number;
  poolConfig: LiquidityPoolKeysV4;
}

const DepositModal: FC<DepositModalProps> = ({
  visible,
  onCancel,
  quoteToken,
  currentSolanaPriceUSD,
}) => {
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();
  const { connected } = useWallet();

  const [isVerify, setIsVerify] = useState(false);

  const { formControl, quoteValue, totalValue } = useHandleSwap(
    quoteToken,
    currentSolanaPriceUSD,
  );

  const [baseValue, setBaseValue] = useState<string>('');

  const isDepositBtnEnabled =
    poolInfo && connected && isVerify && Number(baseValue) > 0;

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
        <div className={styles.inputWrapper}>
          <div className={styles.token}>
            <img src={SOL_TOKEN.logoURI} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{SOL_TOKEN.symbol}</p>
          </div>

          <Controller
            control={formControl}
            render={({ field: { onChange, value } }) => (
              <NumericInput
                className={styles.input}
                value={value}
                onChange={onChange}
              />
            )}
            name={InputControlsNames.BASE_VALUE}
          />
        </div>
        <div className={styles.inputWrapper}>
          <div className={styles.token}>
            <img src={quoteToken.logoURI} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{quoteToken.symbol}</p>
          </div>
          <Controller
            control={formControl}
            render={({ field: { onChange, value } }) => (
              <NumericInput
                className={styles.input}
                value={quoteValue}
                onChange={onChange}
              />
            )}
            name={InputControlsNames.QUOTE_VALUE}
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
            // onChange={setTotalValue}
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
          <CustomCheckbox
            onChange={() => setIsVerify(!isVerify)}
            checked={isVerify}
          />
          <p className={styles.text}>
            I verify that I have read the{' '}
            <a href="#" target="_blank" rel="noopener noreferrer">
              Fraktion Pools Guide
            </a>{' '}
            and understand the risks of providing liquidity, including
            impermanent loss.
          </p>
        </div>
        <Button
          className={styles.depositBtn}
          type="alternative"
          disabled={!isDepositBtnEnabled}
        >
          Deposit
        </Button>
      </div>
    </Modal>
  );
};

export default DepositModal;
