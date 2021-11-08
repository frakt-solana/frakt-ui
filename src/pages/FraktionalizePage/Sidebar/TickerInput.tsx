import { useEffect } from 'react';

import { Input } from '../../../components/Input';

export const TickerInput = ({
  value = '',
  setTicker,
  isTickerAvailable,
  tickerError,
  setTickerError = () => {},
}: {
  value: string;
  setTicker: (tocker: string) => void;
  isTickerAvailable: (ticker: string) => boolean;
  tickerError?: string;
  setTickerError?: (error: string) => void;
}): JSX.Element => {
  const validate = (ticker: string) => {
    if (ticker.length && (ticker.length < 3 || !isTickerAvailable(ticker))) {
      return setTickerError("Invalid ticker name or it's already in use");
    }
    setTickerError('');
  };

  useEffect(() => {
    validate(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Input
      onChange={(event) => setTicker(event.target.value.trim())}
      value={value}
      placeholder="XXX"
      disableNumbers
      disableSymbols
      maxLength={4}
      error={!!tickerError}
    />
  );
};
