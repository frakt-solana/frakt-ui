import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import Button from '../../../components/Button';
import NumericInput from '../../../components/NumericInput';
import { UserToken } from '../../../contexts/userTokens/userTokens.model';

import styles from './styles.module.scss';

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
  const [pricePerFraction, setPricePerFraction] = useState<string>(null);
  const [fractionsAmount, setFractionsAmount] = useState<string>(null);

  useEffect(() => {
    setPricePerFraction(null);
    setFractionsAmount(null);
  }, [token]);

  const continueClickHanlder = () => {
    onContinueClick(
      token.mint,
      Number(pricePerFraction),
      Number(fractionsAmount),
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
        <div className={styles.sidebar__fieldWrapper}>
          <p className={styles.sidebar__fieldLabel}>Fraction price</p>
          <NumericInput
            onChange={setPricePerFraction}
            value={pricePerFraction}
            placeholder="0.0"
          />
        </div>
        <div className={styles.sidebar__fieldWrapper}>
          <p className={styles.sidebar__fieldLabel}>Amount of fractions</p>
          <NumericInput
            onChange={setFractionsAmount}
            value={fractionsAmount}
            placeholder="0"
          />
        </div>
      </div>

      <Button
        type="alternative"
        className={styles.sidebar__continueBtn}
        disabled={!pricePerFraction || !fractionsAmount || !token}
        onClick={continueClickHanlder}
      >
        Continue
      </Button>
    </div>
  );
};

export default Sidebar;
