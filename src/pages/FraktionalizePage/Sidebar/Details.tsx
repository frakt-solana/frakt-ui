import React from 'react';
import BN from 'bn.js';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { BuyoutField } from './BuyoutField';
import { shortBigNumber } from '../../../utils';
import { UserNFT } from '../../../contexts/userTokens';
import { Action, ActionKind, SidebarState } from './sidebarState';
import { BasketNameInput } from './BasketNameInput';
import { Form } from 'antd';
import { Input } from '../../../components/Input';
import NumericInput from '../../../components/NumericInput';

interface DetailsProps {
  nfts: UserNFT[];
  sidebarState: SidebarState;
  sidebarDispatch: React.Dispatch<Action>;
}

export const Details = ({
  nfts,
  sidebarState,
  sidebarDispatch,
}: DetailsProps): JSX.Element => {
  const {
    buyoutPrice,
    supply,
    basketName,
    ticker,
    supplyError,
    buyoutPriceError,
    tickerError,
    smallFractionPriceError,
    basketNameError,
  } = sidebarState;

  const pricePerFraktion =
    buyoutPrice && supply && Number(buyoutPrice) / Number(supply);
  const pricePerFrktBN = pricePerFraktion
    ? new BN(pricePerFraktion * 10e5)
    : null;

  const [form] = Form.useForm();

  return (
    <div className={styles.sidebar__details}>
      <p className={styles.sidebar__detailsTitle}>Vault details</p>

      <div className={styles.sidebar__fieldWrapper}>
        <p className={styles.sidebar__fieldLabel}>
          {nfts.length > 1 ? 'Basket name' : 'Name'}
        </p>
        {!nfts.length && <p className={styles.sidebar__tokenName}>Unknown</p>}
        {nfts.length === 1 && (
          <p className={styles.sidebar__tokenName}>{nfts[0].metadata.name}</p>
        )}
        {nfts.length > 1 && (
          <BasketNameInput
            checkValidation={nfts.length > 1}
            basketName={basketName}
            setBasketName={(basketName) =>
              sidebarDispatch({
                type: ActionKind.SetBasketName,
                payload: basketName,
              })
            }
            error={basketNameError}
            setError={(error) =>
              sidebarDispatch({
                type: ActionKind.SetBasketNameError,
                payload: error,
              })
            }
          />
        )}
      </div>
      <Form
        autoComplete="off"
        layout="vertical"
        initialValues={{ ticker: '', supply: '', buyoutPrice: '' }}
      >
        <div className={styles.sidebar__fieldWrapperDouble}>
          <div className={styles.sidebar__fieldWrapper}>
            <Form.Item label="Supply" name="supply">
              <NumericInput
                placeholder="1000"
                positiveOnly
                integerOnly
                maxLength={9}
              />
            </Form.Item>
          </div>
          <div className={styles.sidebar__fieldWrapper}>
            <Form.Item label="Ticker" name="ticker">
              <Input
                placeholder="XXX"
                disableNumbers
                disableSymbols
                maxLength={4}
                error={!!tickerError}
              />
            </Form.Item>
          </div>
        </div>
        <div className={styles.fraktionPrice}>
          Fraktion price
          <span className={styles.line} />
          {!smallFractionPriceError && (
            <>
              {pricePerFrktBN ? shortBigNumber(pricePerFrktBN, 2, 6) : '0.00'}{' '}
              SOL
            </>
          )}
          {smallFractionPriceError && 'Error'}
        </div>
        <Form.Item label="Buyout price" name="buyoutPrice">
          <BuyoutField
            buyoutPrice={buyoutPrice}
            setBuyoutPrice={(buyoutPrice) =>
              sidebarDispatch({
                type: ActionKind.SetBuyoutPrice,
                payload: buyoutPrice,
              })
            }
            maxLength={5}
            error={buyoutPriceError}
            setError={(error) =>
              sidebarDispatch({
                type: ActionKind.SetBuyoutPriceError,
                payload: error,
              })
            }
          />
        </Form.Item>
      </Form>
      <div
        className={classNames(
          styles.sidebar__fieldWrapper,
          styles.sidebar__fieldWrapper_error,
        )}
      >
        {[
          smallFractionPriceError,
          buyoutPriceError,
          tickerError,
          supplyError,
          basketNameError,
        ]
          .filter((error) => error)
          .map((error, idx) => (
            <p className={styles.err} key={idx}>
              {error}
            </p>
          ))}
      </div>
    </div>
  );
};
