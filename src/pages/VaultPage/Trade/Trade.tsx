/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useCallback, useEffect, useRef } from 'react';
import Orderbook from '../../../components/SerumOrderbook';
import TradeForm from '../../../components/SerumTradeForm';
import { MarketProvider } from '../../../utils/serum-utils/markets';

export default function Market({ marketAddress }) {
  useEffect(() => {
    if (marketAddress) {
      localStorage.setItem('marketAddress', JSON.stringify(marketAddress));
    }
  }, [marketAddress]);

  function setMarketAddress(address) {}

  const changeOrderRef =
    useRef<({ size, price }: { size?: number; price?: number }) => void>();

  const onChangeOrderRef = (ref) => (changeOrderRef.current = ref);
  const onPrice = useCallback(
    (price) => changeOrderRef.current && changeOrderRef.current({ price }),
    [],
  );
  const onSize = useCallback(
    (size) => changeOrderRef.current && changeOrderRef.current({ size }),
    [],
  );

  return (
    <MarketProvider
      marketAddress={marketAddress}
      setMarketAddress={setMarketAddress}
    >
      <TradeForm setChangeOrderRef={onChangeOrderRef} />
      <Orderbook depth={6} smallScreen onPrice={onPrice} onSize={onSize} />
    </MarketProvider>
  );
}
