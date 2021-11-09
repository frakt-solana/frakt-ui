import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import Button from '../../../components/Button';
import { UserNFT } from '../../../contexts/userTokens/userTokens.model';
import styles from './styles.module.scss';
import { TickerInput } from './TickerInput';
import { SupplyInput } from './SupplyInput';
import { BuyoutField } from './BuyoutField';

interface SidebarProps {
  onRemoveClick?: () => void;
  onContinueClick: (
    userNft: UserNFT,
    tickerName: string,
    pricePerFraction: number,
    fractionsAmount: number,
  ) => void;
  token: UserNFT;
  isTickerAvailable: (tickerName: string) => boolean;
}

const Sidebar = ({
  onRemoveClick,
  token,
  onContinueClick,
  isTickerAvailable,
}: SidebarProps): JSX.Element => {
  const [buyoutPrice, setBuyoutPrice] = useState<string>('');
  const [supply, setSupply] = useState<string>('');
  const [ticker, setTicker] = useState<string>('');

  const [tickerError, setTickerError] = useState<string>('');
  const [supplyError, setSupplyError] = useState<string>('');
  const [buyoutPriceError, setBuyoutPriceError] = useState<string>('');
  const [smallFractionPriceError, setSmallFractionPriceError] =
    useState<string>('');

  const validateFractionPrice = () => {
    if (
      supply.length &&
      buyoutPrice.length &&
      Number(buyoutPrice) / Number(supply) < 1e-6
    ) {
      return setSmallFractionPriceError(
        'Price per fraction must be greater than 1e-6',
      );
    }
    setSmallFractionPriceError('');
  };

  useEffect(() => {
    validateFractionPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supply, buyoutPrice]);

  useEffect(() => {
    setBuyoutPrice('');
    setSupply('');
    setTicker('');
  }, [token]);

  const continueClickHanlder = () => {
    onContinueClick(
      token,
      ticker,
      Number(buyoutPrice) / Number(supply),
      Number(supply),
    );
  };

  const isBtnDisabled = () => {
    return (
      !!smallFractionPriceError ||
      !buyoutPrice ||
      !!buyoutPriceError ||
      !supply ||
      !!supplyError ||
      !token ||
      ticker?.length < 3 ||
      !!tickerError
    );
  };

  return (
    <div
      className={classNames([
        styles.sidebar,
        { [styles.sidebar_visible]: !!token },
      ])}
    >
      <div className={styles.sidebar__header}>
        <p className={styles.sidebar__title}>Your NFT</p>
        <div
          className={styles.sidebar__image}
          style={{ backgroundImage: `url(${token?.metadata?.image})` }}
        >
          <button
            className={styles.sidebar__removeBtn}
            onClick={onRemoveClick}
          />
        </div>
        <div className={styles.sidebar__separator} />
      </div>

      <div className={styles.sidebar__details}>
        <p className={styles.sidebar__detailsTitle}>Vault details</p>

        <div className={styles.sidebar__fieldWrapper}>
          <p className={styles.sidebar__fieldLabel}>Name</p>
          <p className={styles.sidebar__tokenName}>
            {token?.metadata?.name || 'Unknown'}
          </p>
        </div>
        <div className={styles.sidebar__fieldWrapperDouble}>
          <div className={styles.sidebar__fieldWrapper}>
            <p className={styles.sidebar__fieldLabel}>Supply</p>
            <SupplyInput
              supply={supply}
              setSupply={setSupply}
              error={supplyError}
              setError={setSupplyError}
            />
          </div>
          <div className={styles.sidebar__fieldWrapper}>
            <p className={styles.sidebar__fieldLabel}>Ticker</p>
            <TickerInput
              value={ticker}
              setTicker={setTicker}
              isTickerAvailable={isTickerAvailable}
              tickerError={tickerError}
              setTickerError={setTickerError}
            />
          </div>
        </div>
        <div className={styles.sidebar__fieldWrapper}>
          <p className={styles.sidebar__fieldLabel}>Buyout price</p>
          <BuyoutField
            buyoutPrice={buyoutPrice}
            setBuyoutPrice={setBuyoutPrice}
            error={buyoutPriceError}
            setError={setBuyoutPriceError}
          />
        </div>
        <div
          className={classNames(
            styles.sidebar__fieldWrapper,
            styles.sidebar__fieldWrapper_error,
          )}
        >
          {[smallFractionPriceError, buyoutPriceError, tickerError, supplyError]
            .filter((error) => error)
            .map((error, idx) => (
              <p key={idx}>{error}</p>
            ))}
        </div>
      </div>

      <Button
        type="alternative"
        className={styles.sidebar__continueBtn}
        disabled={isBtnDisabled()}
        onClick={continueClickHanlder}
      >
        Continue
      </Button>
    </div>
  );
};

export default Sidebar;
