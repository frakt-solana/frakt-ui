import { useEffect, useReducer } from 'react';
import classNames from 'classnames/bind';

import Button from '../../../components/Button';
import { UserNFT } from '../../../contexts/userTokens';
import styles from './styles.module.scss';
import { Header } from './Header';
import { Details } from './Details';
import {
  sidebarReducer,
  initialSidebarState,
  ActionKind,
} from './sidebarState';

interface SidebarProps {
  onDeselect?: (nft: UserNFT) => void;
  onContinueClick: (
    userNfts: UserNFT[],
    tickerName: string,
    pricePerFraction: number,
    fractionsAmount: number,
    basketName?: string,
  ) => void;
  nfts: UserNFT[];
}

const Sidebar = ({
  onDeselect,
  nfts,
  onContinueClick,
}: SidebarProps): JSX.Element => {
  const [state, dispatch] = useReducer(sidebarReducer, initialSidebarState);

  const validateFractionPrice = () => {
    if (
      state.supply.length &&
      state.buyoutPrice.length &&
      Number(state.buyoutPrice) / Number(state.supply) < 1e-6
    ) {
      return dispatch({
        type: ActionKind.SetSmallFractionPriceError,
        payload: 'Price per fraktion must be greater than 1e-6',
      });
    }
    dispatch({
      type: ActionKind.SetSmallFractionPriceError,
      payload: '',
    });
  };

  useEffect(() => {
    validateFractionPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.supply, state.buyoutPrice]);

  useEffect(() => {
    !nfts.length && dispatch({ type: ActionKind.ResetState });
  }, [nfts.length]);

  const continueClickHanlder = () => {
    onContinueClick(
      nfts,
      state.ticker,
      Number(state.buyoutPrice) / Number(state.supply),
      Number(state.supply),
      state.basketName,
    );
  };

  const isBtnDisabled = () => {
    const error =
      !!state.smallFractionPriceError ||
      !!state.buyoutPriceError ||
      !!state.supplyError ||
      !!state.tickerError;

    const emptyFields = !state.buyoutPrice || !state.supply;

    const noNfts = !nfts.length;

    const shortTicker = state.ticker?.length < 3;

    const noBasketName = nfts.length > 1 && state.basketName.length < 3;

    return error || emptyFields || noNfts || shortTicker || noBasketName;
  };

  return (
    <div
      className={classNames([
        styles.sidebar,
        { [styles.sidebar_visible]: !!nfts.length },
      ])}
    >
      <Header nfts={nfts} onDeselect={onDeselect} />
      <Details nfts={nfts} sidebarState={state} sidebarDispatch={dispatch} />

      <div className={styles.sidebar__continueBtnContainer}>
        <p className={styles.sidebar__feeMessage}>
          * Fraktionalization fees:
          <br />
          0.5% of buyout price [min. 0.5 SOL]
        </p>
        <Button
          type="alternative"
          className={styles.sidebar__continueBtn}
          disabled={isBtnDisabled()}
          onClick={continueClickHanlder}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
