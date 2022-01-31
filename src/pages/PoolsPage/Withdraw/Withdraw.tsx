import { FC, useState } from 'react';

import { TokenFieldWithBalance } from '../../../components/TokenField';
import { TokenInfo } from '@solana/spl-token-registry';
import Button from '../../../components/Button';
import styles from './styles.module.scss';

interface WithdrawInterface {
  quoteToken: TokenInfo;
}

const Withdraw: FC<WithdrawInterface> = ({ quoteToken }) => {
  const [withdrawValue, setWithdrawValue] = useState<string>('');

  return (
    <div className={styles.withdraw}>
      <div className={styles.header}>
        <p className={styles.title}>Withdraw</p>
        <p className={styles.balance}>Balance: 250.325246317</p>
      </div>
      <div className={styles.footer}>
        <TokenFieldWithBalance
          className={styles.input}
          value={withdrawValue}
          onValueChange={(nextValue) => setWithdrawValue(nextValue)}
          style={{ width: '100%' }}
          showMaxButton
          lpTokenSymbol={quoteToken.symbol}
        />
        <Button type="tertiary" className={styles.rewardBtn}>
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Withdraw;
