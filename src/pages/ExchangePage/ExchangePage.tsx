import { useState } from 'react';
import { AppLayout } from '../../components/Layout/AppLayout';
import TokenField from '../../components/TokenField';

const ExchangePage = (): JSX.Element => {
  const [value, setValue] = useState<number>(null);

  const openSelectModal = () => {};
  const setMaxValue = () => {};

  return (
    <AppLayout>
      <TokenField
        style={{ maxWidth: 730, marginTop: 48 }}
        value={value}
        onChange={setValue}
        onUseMaxButtonClick={setMaxValue}
        onSelectTokenClick={openSelectModal}
        token={{
          name: 'ETH',
          imageSrc: 'https://img.paraswap.network/ETH.png',
        }}
      />
      {/* <p>Exchange page</p> */}
    </AppLayout>
  );
};

export default ExchangePage;
