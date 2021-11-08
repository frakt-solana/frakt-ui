import { useEffect } from 'react';

import NumericInput from '../../../components/NumericInput';

interface SupplyInputProps {
  supply: string;
  setSupply: (supply: string) => void;
  error?: string;
  setError?: (error: string) => void;
}

export const SupplyInput = ({
  supply,
  setSupply,
  error,
  setError = () => {},
}: SupplyInputProps): JSX.Element => {
  const validate = (supply: string) => {
    if (supply.length && (Number(supply) < 1000 || Number(supply) > 1e8)) {
      return setError('Supply must be in the range: 1k - 100kk');
    }
    setError('');
  };

  useEffect(() => {
    validate(supply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supply]);

  return (
    <NumericInput
      onChange={setSupply}
      value={supply}
      placeholder="1000"
      positiveOnly
      integerOnly
      error={!!error}
    />
  );
};
