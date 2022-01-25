import { FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Controller } from 'react-hook-form';
import BN from 'bn.js';

import { InputControlsNames } from '../DepositModal/hooks';
import { TokenFieldWithBalance } from '../TokenField';
import { useCreateLiquidityForm } from './hooks';
import Checkbox from '../CustomCheckbox';
import NumericInput from '../NumericInput';
import styles from './styles.module.scss';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';

interface LiquidityFormInterface {
  defaultTokenMint: string;
  vaultLockedPrice: BN;
}

const CreateLiquidityForm: FC<LiquidityFormInterface> = ({
  defaultTokenMint,
  vaultLockedPrice,
}) => {
  const { formControl, totalValue, isCreateBtnEnabled, quoteToken } =
    useCreateLiquidityForm(vaultLockedPrice, defaultTokenMint);

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <Controller
          render={({ field: { onChange, value } }) => (
            <TokenFieldWithBalance
              className={styles.input}
              onValueChange={onChange}
              value={value}
              currentToken={SOL_TOKEN}
            />
          )}
          name={InputControlsNames.BASE_VALUE}
          control={formControl}
        />
        <PlusOutlined className={styles.plusIcon} />
        <Controller
          render={({ field: { onChange, value } }) => (
            <TokenFieldWithBalance
              className={styles.input}
              onValueChange={onChange}
              value={value}
              currentToken={quoteToken}
            />
          )}
          name={InputControlsNames.QUOTE_VALUE}
          control={formControl}
        />
      </div>

      <p className={styles.label}>Total</p>
      <NumericInput className={styles.input} value={totalValue} readOnly />

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
          and understand the risks of providing liquidity, including impermanent
          loss.
        </p>
      </div>

      <Button
        className={styles.createPoolBtn}
        type="alternative"
        disabled={!isCreateBtnEnabled}
      >
        Create liquidity pool
      </Button>
    </div>
  );
};

export default CreateLiquidityForm;
