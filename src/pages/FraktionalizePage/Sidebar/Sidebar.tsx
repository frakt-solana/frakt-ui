import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import Button from '../../../components/Button';
import NumericInput from '../../../components/NumericInput';
import { UserNFT } from '../../../contexts/userTokens/userTokens.model';

import styles from './styles.module.scss';
import { Input } from '../../../components/Input';
import TokenField from '../../../components/TokenField';
import { Token } from '../../../utils';

export const MOCK_TOKEN_LIST = [
  {
    mint: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    img: 'https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png',
    data: 'Some value 1',
  },
  {
    mint: '2kMr32vCwjehHizggK4Gdv7izk7NhTUyLrH7RYvQRFHH',
    symbol: 'FRKT',
    img: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/ErGB9xa24Szxbk1M28u2Tx8rKPqzL6BroNkkzk5rG4zj/logo.png',
    data: 'Some value 1',
  },
];

interface SidebarProps {
  onRemoveClick?: () => void;
  onContinueClick: (
    tokenMint: string,
    pricePerFraction: number,
    fractionsAmount: number,
  ) => void;
  token: UserNFT;
}

const Sidebar = ({
  onRemoveClick,
  token,
  onContinueClick,
}: SidebarProps): JSX.Element => {
  const [buyoutPrice, setBuyoutPrice] = useState<string>(null);
  const [fractionsAmount, setFractionsAmount] = useState<string>(null);
  const [symbol, setSymbol] = useState<string>(null);
  const [buyoutToken, setBuyoutToken] = useState<Token>(MOCK_TOKEN_LIST[0]);

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
              // className={styles.sidebar__stringInput}
              onChange={(event) => setSymbol(event.target.value.toUpperCase())}
              value={symbol}
              placeholder="XXX"
              disableNumbers
              disableSymbols
              maxLength={5}
            />
          </div>
        </div>
        <div className={styles.sidebar__fieldWrapper}>
          <p className={styles.sidebar__fieldLabel}>Buyout price</p>
          <TokenField
            className={styles.priceField}
            value={buyoutPrice}
            onValueChange={setBuyoutPrice}
            // tokensList={MOCK_TOKEN_LIST}
            onTokenChange={setBuyoutToken}
            currentToken={buyoutToken}
            modalTitle="Select token"
          />
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
