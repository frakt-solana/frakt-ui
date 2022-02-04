import { FC } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Controller } from 'react-hook-form';
import BN from 'bn.js';

import { InputControlsNames } from '../DepositModal/hooks';
import { TokenFieldWithBalance } from '../TokenField';
import { useCreateLiquidityForm } from './hooks';
import Checkbox from '../CustomCheckbox';
import styles from './styles.module.scss';
import { SOL_TOKEN } from '../../utils';
import Button from '../Button';
import { useLiquidityPools } from '../../contexts/liquidityPools';
import { PublicKey } from '@solana/web3.js';

interface LiquidityFormInterface {
  defaultTokenMint: string;
  vaultLockedPrice: BN;
  marketAddress: string;
}

const CreateLiquidityForm: FC<LiquidityFormInterface> = ({
  defaultTokenMint,
  vaultLockedPrice,
  marketAddress,
}) => {
  const {
    formControl,
    totalValue,
    isCreateBtnEnabled,
    tokenInfo,
    baseValue,
    quoteValue,
    handleSwap,
  } = useCreateLiquidityForm(vaultLockedPrice, defaultTokenMint);
  const { createRaydiumLiquidityPool } = useLiquidityPools();

  const onCreateLiquidityHandler = () => {
    const baseAmount = new BN(parseFloat(baseValue) * 10 ** tokenInfo.decimals);
    const quoteAmount = new BN(
      parseFloat(quoteValue) * 10 ** SOL_TOKEN.decimals,
    );

    const marketId = new PublicKey(marketAddress);

    createRaydiumLiquidityPool({
      baseAmount,
      quoteAmount,
      baseToken: tokenInfo,
      quoteToken: SOL_TOKEN,
      marketId,
    });
  };

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
        onClick={onCreateLiquidityHandler}
      >
        Create liquidity pool
      </Button>
    </div>
  );
};

export default CreateLiquidityForm;
