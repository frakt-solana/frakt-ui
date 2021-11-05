import { useState } from 'react';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Token } from '../../utils';
import styles from './styles.module.scss';
import SettingsIcon from '../../icons/SettingsIcon';
import Button from '../../components/Button';
import TokenField from '../../components/TokenField';

export const MOCK_TOKEN_LIST = [
  {
    mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    img: 'https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png',
    data: 'Some value 1',
  },
  {
    mint: '2kMr32vCwjehHizggK4Gdv7izk7NhTUyLrH7RYvQRFHH',
    symbol: 'FRKT',
    img: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj/logo.png',
    data: 'Some value 1',
  },
  {
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    img: 'https://sdk.raydium.io/icons/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v.png',
    data: 'Some value 2',
  },
  {
    mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    symbol: 'RAY',
    img: 'https://sdk.raydium.io/icons/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R.png',
    data: 'Some value 3',
  },
  {
    mint: '3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR',
    symbol: 'LIKE',
    img: 'https://sdk.raydium.io/icons/3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR.png',
    data: 'Some value 4',
  },
  {
    mint: 'PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y',
    symbol: 'PORT',
    img: 'https://sdk.raydium.io/icons/PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y.png',
    data: 'Some value 5',
  },
  {
    mint: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    symbol: 'SRM',
    img: 'https://sdk.raydium.io/icons/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt.png',
    data: 'Some value 6',
  },
];

const ExchangePage = (): JSX.Element => {
  const [payValue, setPayValue] = useState<string>(null);
  const [payToken, setPayToken] = useState<Token>(MOCK_TOKEN_LIST[0]);

  const [receiveValue, setReceiveValue] = useState<string>(null);
  const [receiveToken, setReceiveToken] = useState<Token>(MOCK_TOKEN_LIST[1]);

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
          value={payValue}
          onValueChange={(nextValue) => setPayValue(nextValue)}
          tokensList={MOCK_TOKEN_LIST}
          currentToken={payToken}
          onTokenChange={setPayToken}
          onUseMaxButtonClick={setMaxValue}
          modalTitle="Pay"
          label="Pay"
        />
        <TokenField
          className={styles.input}
          value={receiveValue}
          onValueChange={(nextValue) => setReceiveValue(nextValue)}
          currentToken={receiveToken}
          tokensList={MOCK_TOKEN_LIST}
          onTokenChange={setReceiveToken}
          onUseMaxButtonClick={setMaxValue}
          modalTitle="Receive"
          label="Receive"
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
