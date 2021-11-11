import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import Button from '../../../components/Button';
import { UserNFT } from '../../../contexts/userTokens/userTokens.model';
import styles from './styles.module.scss';
import NumericInput from '../../../components/NumericInput';
import TokenField from '../../../components/TokenField';
import { Input } from '../../../components/Input';

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

interface Form {
  supply?: boolean;
  buyoutPrice?: boolean;
  ticker?: boolean;
}

type Validators = {
  [n in keyof Form]: (value: string) => boolean;
};

const Sidebar = ({
  onRemoveClick,
  token,
  onContinueClick,
  isTickerAvailable,
}: SidebarProps): JSX.Element => {
  const [buyoutPrice, setBuyoutPrice] = useState<string>('');
  const [supply, setSupply] = useState<string>('');
  const [ticker, setTicker] = useState<string>('');
  const [touched, setTouched] = useState<Form>({});

  const [tickerError, setTickerError] = useState<string>('');
  const [supplyError, setSupplyError] = useState<string>('');
  const [buyoutPriceError, setBuyoutPriceError] = useState<string>('');
  const [smallFractionPriceError, setSmallFractionPriceError] =
    useState<string>('');

  const touchField = (field: keyof Form) => () => {
    return !touched[field] && setTouched((val) => ({ ...val, [field]: true }));
  };

  const validators: Validators = {
    ticker: (ticker: string) => {
      if (!ticker.length || ticker.length < 3 || !isTickerAvailable(ticker)) {
        setTickerError("Invalid ticker name or it's already in use");
        return false;
      }
      setTickerError('');
      return true;
    },
    supply: (supply: string) => {
      if (!supply.length || Number(supply) < 1000 || Number(supply) > 1e8) {
        setSupplyError('Supply must be in the range: 1k - 100kk');
        return false;
      }
      setSupplyError('');
      return true;
    },
    buyoutPrice: (buyoutPrice: string) => {
      if (
        !buyoutPrice.length ||
        Number(buyoutPrice) < 1 ||
        Number(buyoutPrice) > 50000
      ) {
        setBuyoutPriceError('Buyout price must be in the range: 1 - 50k');
        return false;
      }
      setBuyoutPriceError('');
      return true;
    },
  };

  const validateFractionPrice = (): boolean => {
    if (
      supply.length &&
      buyoutPrice.length &&
      Number(buyoutPrice) / Number(supply) < 1e-6
    ) {
      setSmallFractionPriceError(
        'Price per fraktion must be greater than 1e-6',
      );
      return false;
    }
    setSmallFractionPriceError('');
    return true;
  };

  useEffect(() => {
    validateFractionPrice();
  }, [supply, buyoutPrice]);

  useEffect(() => {
    validateFractionPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supply, buyoutPrice]);

  useEffect(() => {
    setBuyoutPrice('');
    setSupply('');
    setTicker('');
    setTouched({});
  }, [token]);

  const continueClickHanlder = () => {
    if (!isFormValid()) {
      setTouched({
        buyoutPrice: true,
        supply: true,
        ticker: true,
      });
      return;
    }
    onContinueClick(
      token,
      ticker,
      Number(buyoutPrice) / Number(supply),
      Number(supply),
    );
  };

  const isFormValid = () => {
    const validated = [
      validators.supply(supply),
      validators.ticker(ticker),
      validators.buyoutPrice(buyoutPrice),
      validateFractionPrice(),
    ];

    for (let i = 0; i < validated.length; i++) if (!validated[i]) return false;

    return true;
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
            <NumericInput
              value={supply}
              onChange={(value) => {
                setSupply(value);
                validators.supply(value);
              }}
              error={touched.supply && !!supplyError}
              onBlur={touchField('supply')}
            />
          </div>
          <div className={styles.sidebar__fieldWrapper}>
            <p className={styles.sidebar__fieldLabel}>Ticker</p>
            <Input
              value={ticker}
              onChange={(e) => {
                setTicker(e.target.value);
                validators.ticker(e.target.value);
              }}
              error={touched.ticker && !!tickerError}
              onBlur={touchField('ticker')}
            />
          </div>
        </div>
        <div className={styles.sidebar__fieldWrapper}>
          <p className={styles.sidebar__fieldLabel}>Buyout price</p>
          <TokenField
            currentToken={{
              mint: 'So11111111111111111111111111111111111111112',
              symbol: 'SOL',
              img: 'https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png',
              data: 'Some value 1',
            }}
            value={buyoutPrice}
            onValueChange={(value) => {
              setBuyoutPrice(value);
              validators.buyoutPrice(value);
            }}
            error={touched.buyoutPrice && !!buyoutPriceError}
            onInputBlur={touchField('buyoutPrice')}
          />
        </div>
        <div
          className={classNames(
            styles.sidebar__fieldWrapper,
            styles.sidebar__fieldWrapper_error,
          )}
        >
          {[
            smallFractionPriceError,
            touched.buyoutPrice && buyoutPriceError,
            touched.ticker && tickerError,
            touched.supply && supplyError,
          ]
            .filter((error) => error)
            .map((error, idx) => (
              <p key={idx}>{error}</p>
            ))}
        </div>
      </div>

      <div className={styles.sidebar__continueBtnContainer}>
        <p className={styles.sidebar__feeMessage}>
          * Fraktionalization fees:
          <br />
          0.5% of buyout price [min. 0.5 SOL]
        </p>
        <Button
          type="alternative"
          className={styles.sidebar__continueBtn}
          onClick={continueClickHanlder}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
