import { useState } from 'react';
import { AppLayout } from '../../components/Layout/AppLayout';
import TokenField, { TokenFieldValue } from '../../components/TokenField';
import { DEFAULT_TOKEN } from '../../utils';

const ExchangePage = (): JSX.Element => {
  const [value, setValue] = useState<TokenFieldValue>({
    amount: 0,
    token: DEFAULT_TOKEN,
  });

  const setMaxValue = () => {};

  return (
    <AppLayout>
      <TokenField
        style={{ maxWidth: 730, marginTop: 48 }}
        value={value}
        onChange={setValue}
        onUseMaxButtonClick={setMaxValue}
      />
      {/* <p>Exchange page</p> */}
    </AppLayout>
  );
};

export default ExchangePage;
