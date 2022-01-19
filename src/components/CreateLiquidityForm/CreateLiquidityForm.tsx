import { FC, useState } from 'react';

import { PlusOutlined } from '@ant-design/icons';
import { TokenInfo } from '@solana/spl-token-registry';
import { SOL_TOKEN } from '../../utils';
import { TokenFieldWithBalance } from '../TokenField';
import Button from '../Button';
import styles from './styles.module.scss';
import NumericInput from '../NumericInput';
import { useTokenByMint } from './hooks';
import CustomCheckbox from '../CustomCheckbox';

interface LiquidityFormInterface {
  defaultTokenMint?: string;
}

const CreateLiquidityForm: FC<LiquidityFormInterface> = ({
  defaultTokenMint,
}) => {
  const token = useTokenByMint(defaultTokenMint);
  const [totalValue, setTotalValue] = useState<string>('');

  const [baseValue, setBaseValue] = useState<string>('');

  const [quoteValue, setQuoteValue] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quoteToken, setQuoteToken] = useState<TokenInfo | null>(token || null);

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <TokenFieldWithBalance
          className={styles.input}
          value={baseValue}
          onValueChange={(nextValue) => setBaseValue(nextValue)}
          currentToken={SOL_TOKEN}
        />
        <PlusOutlined className={styles.plusIcon} />
        <TokenFieldWithBalance
          className={styles.input}
          value={quoteValue}
          onValueChange={(nextValue) => setQuoteValue(nextValue)}
          currentToken={quoteToken}
        />
      </div>
      <div>
        <p className={styles.label}>Total</p>
        <NumericInput
          className={styles.input}
          value={totalValue}
          onChange={setTotalValue}
        />
      </div>

      <div className={styles.verify}>
        <CustomCheckbox />
        <p className={styles.text}>
          I verify that I have read the{' '}
          <a href="#" target="_blank" rel="noopener noreferrer">
            Fraktion Pools Guide
          </a>{' '}
          and understand the risks of providing liquidity, including impermanent
          loss.
        </p>
      </div>

      <Button className={styles.createPoolBtn} type="alternative">
        Create liquidity pool
      </Button>
    </div>
  );
};

export default CreateLiquidityForm;
