import { FC } from 'react';
import BN from 'bn.js';
import { Controller } from 'react-hook-form';
import { LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import { InputControlsNames, useDeposit } from './hooks';
import Checkbox from '../CustomCheckbox';
import NumericInput from '../NumericInput';
import styles from './styles.module.scss';
import { SOL_TOKEN } from '../../utils';
import { Modal } from '../Modal';
import Button from '../Button';
import {
  FusionPoolInfo,
  formatNumberToCurrency,
  useLiquidityPools,
} from '../../contexts/liquidityPools';
import { PoolStats } from '../../pages/PoolsPage/hooks/useLazyPoolsStats';

interface DepositModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onCancel: () => void;
  tokenInfo: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  fusionPoolInfo: FusionPoolInfo;
  poolStats: PoolStats;
}

const DepositModal: FC<DepositModalProps> = ({
  visible,
  setVisible,
  onCancel,
  tokenInfo,
  poolConfig,
  fusionPoolInfo,
  poolStats,
}) => {
  const {
    formControl,
    isDepositBtnEnabled,
    totalValue,
    handleChange,
    handleBlur,
    baseValue,
    quoteValue,
    liquiditySide,
  } = useDeposit(tokenInfo, poolConfig);

  const { addRaydiumLiquidity, stakeLiquidity } = useLiquidityPools();

  const onSubmitHandler = async () => {
    const baseAmount = new BN(Number(baseValue) * 10 ** tokenInfo.decimals);
    const quoteAmount = new BN(Number(quoteValue) * 1e9);

    await addRaydiumLiquidity({
      baseToken: tokenInfo,
      baseAmount,
      quoteToken: SOL_TOKEN,
      quoteAmount,
      poolConfig,
      fixedSide: liquiditySide,
    });

    if (fusionPoolInfo) {
      const { mainRouter } = fusionPoolInfo;

      await stakeLiquidity({
        amount: new BN(1e6),
        router: mainRouter,
      });
    }
    setVisible(false);
  };

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
          <NumericInput
            className={styles.input}
            value={quoteValue}
            onChange={(value) =>
              handleChange(value, InputControlsNames.QUOTE_VALUE)
            }
            onBlur={() => handleBlur('a')}
          />
        </div>
        <div className={styles.inputWrapper}>
          <div className={styles.token}>
            <img src={tokenInfo.logoURI} className={styles.tokenIcon} />
            <p className={styles.tokenName}>{tokenInfo.symbol}</p>
          </div>
          <NumericInput
            className={styles.input}
            value={baseValue}
            onChange={(value) =>
              handleChange(value, InputControlsNames.BASE_VALUE)
            }
            onBlur={() => handleBlur('b')}
          />
        </div>
        <div className={styles.totalLine}>
          <p className={styles.title}>Total</p>
          <div className={styles.line} />
        </div>
        <div className={styles.totalInputWrapper}>
          <div className={styles.totalValue}>
            {formatNumberToCurrency(parseFloat(totalValue))}
          </div>
        </div>
        <p className={styles.subtitle}>Estimated earnings from fees (7d)</p>
        <div className={styles.depositContent}>
          <div className={styles.depositInfo}>
            <p className={styles.value}>
              {formatNumberToCurrency(
                parseFloat(totalValue) * (poolStats?.apy / 100) || 0,
              )}{' '}
              <span>/ month</span>
            </p>
            <p className={styles.value}>
              {poolStats?.apy || 0}% <span>/ apy</span>
            </p>
          </div>
          {/* <p className={styles.link}>After staking</p> */}
        </div>
        <div className={styles.verify}>
          <Controller
            control={formControl}
            name={InputControlsNames.IS_VERIFIED}
            render={({ field }) => <Checkbox {...field} />}
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
          onClick={onSubmitHandler}
        >
          Deposit
        </Button>
      </div>
    </Modal>
  );
};

export default DepositModal;
