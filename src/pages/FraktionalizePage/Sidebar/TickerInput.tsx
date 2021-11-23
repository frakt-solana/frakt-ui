import { useEffect } from 'react';

import { Input } from '../../../components/Input';
import { useTokenListContext } from '../../../contexts/TokenList';

export const TickerInput = ({
  value = '',
  setTicker,
  tickerError,
  setTickerError = () => {},
}: {
  value: string;
  setTicker: (tocker: string) => void;
  tickerError?: string;
  setTickerError?: (error: string) => void;
}): JSX.Element => {
  const { tokenList } = useTokenListContext();

  const validate = (ticker: string) => {
    if (
      ticker.length &&
      (ticker.length < 3 || tokenList.find(({ symbol }) => symbol === ticker))
    ) {
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
