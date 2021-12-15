import React from 'react';
import BN from 'bn.js';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { TickerInput } from './TickerInput';
import { SupplyInput } from './SupplyInput';
import { BuyoutField } from './BuyoutField';
import { shortBigNumber } from '../../../utils';
import { UserNFT } from '../../../contexts/userTokens';
import { Action, ActionKind, SidebarState } from './sidebarState';
import { BasketNameInput } from './BasketNameInput';

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
      <div className={styles.sidebar__fieldWrapperDouble}>
        <div className={styles.sidebar__fieldWrapper}>
          <p className={styles.sidebar__fieldLabel}>Supply</p>
          <SupplyInput
            supply={supply}
            setSupply={(supply) =>
              sidebarDispatch({
                type: ActionKind.SetSupply,
                payload: supply,
              })
            }
            error={supplyError}
            maxLength={9}
            setError={(error) =>
              sidebarDispatch({
                type: ActionKind.SetSupplyError,
                payload: error,
              })
            }
          />
        </div>
        <div className={styles.sidebar__fieldWrapper}>
          <p className={styles.sidebar__fieldLabel}>Ticker</p>
          <TickerInput
            value={ticker}
            setTicker={(ticker) =>
              sidebarDispatch({
                type: ActionKind.SetTicker,
                payload: ticker,
              })
            }
            tickerError={tickerError}
            setTickerError={(error) =>
              sidebarDispatch({
                type: ActionKind.SetTickerError,
                payload: error,
              })
            }
          />
        </div>
      </div>
      <div className={styles.fraktionPrice}>
        Fraktion price
        <span className={styles.line} />
        {!smallFractionPriceError && (
          <>
            {pricePerFrktBN ? shortBigNumber(pricePerFrktBN, 2, 6) : '0.00'} SOL
          </>
        )}
        {smallFractionPriceError && 'Error'}
      </div>
      <div className={styles.sidebar__fieldWrapper}>
        <p className={styles.sidebar__fieldLabel}>Buyout price</p>
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
      </div>
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
