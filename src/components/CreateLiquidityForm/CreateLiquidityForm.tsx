import { FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Controller } from 'react-hook-form';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { useCreateLiquidityForm, InputControlsNames } from './hooks';
import { TokenFieldWithBalance } from '../TokenField';
import Checkbox from '../CustomCheckbox';
import styles from './styles.module.scss';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';

interface LiquidityFormInterface {
  defaultTokenMint: string;
  vaultLockedPrice: BN;
  marketId: PublicKey;
}

const CreateLiquidityForm: FC<LiquidityFormInterface> = ({
  defaultTokenMint,
  vaultLockedPrice,
  marketId,
}) => {
  const {
    formControl,
    totalValue,
    isCreateBtnEnabled,
    tokenInfo,
    baseValue,
    quoteValue,
    handleSwap,
    handleCreateLiquidity,
  } = useCreateLiquidityForm(vaultLockedPrice, defaultTokenMint, marketId);

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <TokenFieldWithBalance
          className={styles.input}
          value={quoteValue}
          onValueChange={(value) =>
            handleSwap(value, InputControlsNames.QUOTE_VALUE)
          }
          currentToken={SOL_TOKEN}
        />

        <PlusOutlined className={styles.plusIcon} />
        <TokenFieldWithBalance
          className={styles.input}
          onValueChange={(value) =>
            handleSwap(value, InputControlsNames.BASE_VALUE)
          }
          value={baseValue}
          currentToken={tokenInfo}
        />
      </div>

      <p className={styles.label}>Total</p>
      <div className={styles.input}>{totalValue}</div>

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
        onClick={handleCreateLiquidity}
      >
        Create liquidity pool
      </Button>
    </div>
  );
};

export default CreateLiquidityForm;
