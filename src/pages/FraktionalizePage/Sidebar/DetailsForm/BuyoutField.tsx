import React from 'react';
import TokenField from '../../../../components/TokenField';
import styles from './styles.module.scss';
import { Token } from '../../../../utils';

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
  value?: {
    amount: string;
    token: Token | any;
  };
  onChange?: any;
  maxLength?: number;
}

// TODO This is just a wrapper with one onChange, it makes sense to move it to TokenField.
// Perfect way is: change API of TokenField
export const BuyoutField: React.FC<BuyoutFieldProps> = ({
  onChange,
  value,
}) => {
  const onAmountChange = (amount: string) => onChange?.({ ...value, amount });

  const onTokenChange = (token: Token) => onChange?.({ ...value, token });

  return (
    <TokenField
      value={value.amount}
      currentToken={MOCK_TOKEN_LIST[0]}
      onValueChange={onAmountChange}
      onTokenChange={onTokenChange}
      className={styles.priceField}
      modalTitle="Select token"
      placeholder="1.0"
    />
  );
};
