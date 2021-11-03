import { useState } from 'react';
import { AppLayout } from '../../components/Layout/AppLayout';
import TokenField, { TokenFieldValue } from '../../components/TokenField';
import { DEFAULT_TOKEN } from '../../utils';
import styles from './styles.module.scss';
import SettingsIcon from '../../icons/SettingsIcon';
import Button from '../../components/Button';

const ExchangePage = (): JSX.Element => {
  const [value, setValue] = useState<TokenFieldValue>({
    amount: 0,
    token: DEFAULT_TOKEN,
  });

  const setMaxValue = () => {};

  return (
    <AppLayout contentClassName={styles.exchange}>
      <div className={styles.container}>
        <h1 className={styles.title}>Buy</h1>
        <div className={styles.description}>
          Buy other crypto assets with your crypto assets{' '}
        </div>
        <div className={styles.settings}>
          <SettingsIcon width={24} />
        </div>
        <TokenField
          className={styles.input}
          label="Pay"
          style={{ maxWidth: 730 }}
          value={value}
          onChange={setValue}
          onUseMaxButtonClick={setMaxValue}
        />
        <TokenField
          className={styles.secondInput}
          label="Receive"
          style={{ maxWidth: 730 }}
          value={value}
          onChange={setValue}
          onUseMaxButtonClick={setMaxValue}
        />
        <div className={styles.fee}>
          <span>Estimated fees</span>
          <div />
          <span>$0.00</span>
        </div>
        <div className={styles.fee}>
          <span>Min Received</span>
          <div />
          <span>$0.00</span>
        </div>
      </div>
      <Button className={styles.btn} type="alternative">
        Buy
      </Button>
    </AppLayout>
  );
};

export default ExchangePage;
