import { FC, useEffect, useState } from 'react';
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
import { SOL_TOKEN } from '../../utils';
import { useLazyPoolInfo } from '../SwapForm/hooks';
import { getOutputAmount } from '../SwapForm/helpers';
import { useWallet } from '@solana/wallet-adapter-react';
import { calculateTotalDeposit } from '../../contexts/liquidityPools';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';

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

  const { control } = useForm({ defaultValues: { autoSwap: false } });

  const [totalValue, setTotalValue] = useState<string>('');
  const [baseValue, setBaseValue] = useState<string>('');
  const [quoteValue, setQuoteValue] = useState<string>('');

  useEffect(() => {
    if (SOL_TOKEN && quoteToken && SOL_TOKEN.address !== quoteToken.address) {
      fetchPoolInfo(SOL_TOKEN.address, quoteToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SOL_TOKEN, quoteToken]);

  useEffect(() => {
    if (poolInfo && SOL_TOKEN !== quoteToken) {
      setQuoteValue(getOutputAmount(baseValue, poolInfo, true));
      setTotalValue(
        calculateTotalDeposit(baseValue, quoteValue, currentSolanaPriceUSD),
      );
    }
  }, [baseValue, quoteValue, quoteToken, poolInfo, currentSolanaPriceUSD]);

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
            <img src={SOL_TOKEN.logoURI} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{SOL_TOKEN.symbol}</p>
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
