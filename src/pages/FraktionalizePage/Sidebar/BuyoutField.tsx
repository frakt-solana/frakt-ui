import { useEffect, useState } from 'react';

import TokenField from '../../../components/TokenField';
import { Token } from '../../../utils';
import styles from './styles.module.scss';

const MOCK_TOKEN_LIST = [
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
];

interface BuyoutFieldProps {
  buyoutPrice: string;
  setBuyoutPrice: (supply: string) => void;
  error?: string;
  setError?: (error: string) => void;
}

export const BuyoutField = ({
  buyoutPrice,
  setBuyoutPrice,
  error,
  setError = () => {},
}: BuyoutFieldProps): JSX.Element => {
  const [buyoutToken, setBuyoutToken] = useState<Token>(MOCK_TOKEN_LIST[0]);

  const validate = (buyoutPrice: string) => {
    if (
      buyoutPrice.length &&
      (Number(buyoutPrice) < 1 || Number(buyoutPrice) > 50000)
    ) {
      return setError('Buyout price must be in the range: 1 - 50k');
    }
    setError('');
  };

  useEffect(() => {
    validate(buyoutPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyoutPrice]);

  return (
    <TokenField
      className={styles.priceField}
      value={buyoutPrice}
      onValueChange={setBuyoutPrice}
      // tokensList={MOCK_TOKEN_LIST}
      onTokenChange={setBuyoutToken}
      currentToken={buyoutToken}
      modalTitle="Select token"
      placeholder="1.0"
      error={!!error}
    />
  );
};
