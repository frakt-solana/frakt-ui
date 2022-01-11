import { FC, useState } from 'react';
import { Checkbox } from 'antd';

import { PlusOutlined } from '@ant-design/icons';
import { SOL_TOKEN } from '../SwapForm/constants';
import { TokenFieldWithBalance } from '../TokenField';
import { Token } from '../../utils';
import Button from '../Button';
import styles from './styles.module.scss';
import NumericInput from '../NumericInput';
import { useTokenByMint } from './helper';

interface LiquidityFormInterface {
  defaultTokenMint?: string;
}

const CreateLiquidityForm: FC<LiquidityFormInterface> = ({
  defaultTokenMint,
}) => {
  const token = useTokenByMint(defaultTokenMint);
  const [totalValue, setTotalValue] = useState<string>('');

  const [baseValue, setBaseValue] = useState<string>('');
  const [baseToken, setBaseToken] = useState<Token | null>(SOL_TOKEN);

  const [quoteValue, setQuoteValue] = useState<string>('');
  const [quoteToken, setQuoteToken] = useState<Token | null>(token[0] || null);

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <TokenFieldWithBalance
          className={styles.input}
          value={baseValue}
          onValueChange={(nextValue) => setBaseValue(nextValue)}
          currentToken={baseToken}
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
        <Checkbox />
        <p className={styles.text}>
          I verify that I have read the
          <a href="#" target="_blank" rel="noopener noreferrer">
            Fraktion Pools Guide
          </a>
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
