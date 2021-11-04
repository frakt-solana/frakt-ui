import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import Button from '../../../components/Button';
import NumericInput from '../../../components/NumericInput';
import { UserToken } from '../../../contexts/userTokens/userTokens.model';

import styles from './styles.module.scss';
import { Input } from '../../../components/Input';
import { ChevronDownIcon } from '../../../icons';

interface SidebarProps {
  onRemoveClick?: () => void;
  onContinueClick: (
    tokenMint: string,
    pricePerFraction: number,
    fractionsAmount: number,
  ) => void;
  token: UserToken;
}

const Sidebar = ({
  onRemoveClick,
  token,
  onContinueClick,
}: SidebarProps): JSX.Element => {
  const [buyoutPrice, setBuyoutPrice] = useState<string>(null);
  const [fractionsAmount, setFractionsAmount] = useState<string>(null);
  const [symbol, setSymbol] = useState<string>(null);

  useEffect(() => {
    setBuyoutPrice(null);
    setFractionsAmount(null);
    setSymbol(null);
  }, [token]);

  const continueClickHanlder = () => {
    onContinueClick(
      token.mint,
      Number(buyoutPrice) / Number(fractionsAmount),
      Number(fractionsAmount),
    );
  };

  const isBtnDisabled = () => {
    return (
      !buyoutPrice ||
      !fractionsAmount ||
      !token ||
      !symbol ||
      symbol?.length < 3
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
            <NumericInput
              onChange={setFractionsAmount}
              value={fractionsAmount}
              placeholder="0"
              positiveOnly
              integerOnly
            />
          </div>
          <div className={styles.sidebar__fieldWrapper}>
            <p className={styles.sidebar__fieldLabel}>Symbol</p>
            <Input
              className={styles.sidebar__stringInput}
              onChange={(event) => setSymbol(event.target.value)}
              value={symbol}
              placeholder="XXX"
            />
          </div>
        </div>
        <div className={styles.sidebar__fieldWrapper}>
          <p className={styles.sidebar__fieldLabel}>Buyout price</p>
          <PriceField onChange={setBuyoutPrice} value={buyoutPrice} />
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

const PriceField = ({ onChange, value }): JSX.Element => {
  return (
    <div className={styles.priceField}>
      <NumericInput
        onChange={onChange}
        value={value}
        placeholder="0.0"
        positiveOnly
        className={styles.priceField__valueInput}
      />
      <div>
        <button className={styles.priceField__selectTokenBtn}>
          <img
            className={styles.priceField__tokenLogo}
            src="https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png"
            alt="SOL logo"
          />
          <span>SOL</span>
          <ChevronDownIcon className={styles.priceField__arrowDownIcon} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
