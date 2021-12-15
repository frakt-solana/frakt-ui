export type SidebarState = {
  buyoutPrice: string;
  supply: string;
  ticker: string;
  basketName: string;

  tickerError: string;
  supplyError: string;
  buyoutPriceError: string;
  basketNameError: string;
  smallFractionPriceError: string;
};

export const initialSidebarState: SidebarState = {
  buyoutPrice: '',
  supply: '',
  ticker: '',
  basketName: '',

  tickerError: '',
  supplyError: '',
  buyoutPriceError: '',
  basketNameError: '',
  smallFractionPriceError: '',
};

export enum ActionKind {
  SetBuyoutPrice = 'SET_BUYOUT_PRICE',
  SetSupply = 'SET_SUPPLY',
  SetTicker = 'SET_TICKER',
  SetBasketName = 'SET_BASKET_NAME',

  SetTickerError = 'SET_TICKER_ERROR',
  SetSupplyError = 'SET_SUPPLY_ERROR',
  SetBuyoutPriceError = 'SET_BUYOUT_PRICE_ERROR',
  SetBasketNameError = 'SET_BASKET_NAME_ERROR',
  SetSmallFractionPriceError = 'SET_SMALL_FRACTION_PRICE_ERROR',

  ResetState = 'RESET_STATE',
}

export type Action = {
  type: ActionKind;
  payload?: string;
};

export const sidebarReducer = (
  state: SidebarState,
  action: Action,
): SidebarState => {
  const { type, payload } = action;
  switch (type) {
    case ActionKind.SetBuyoutPrice:
      return {
        ...state,
        buyoutPrice: payload,
      };
    case ActionKind.SetSupply:
      return {
        ...state,
        supply: payload,
      };
    case ActionKind.SetTicker:
      return {
        ...state,
        ticker: payload,
      };
    case ActionKind.SetBasketName:
      return {
        ...state,
        basketName: payload,
      };

    case ActionKind.SetTickerError:
      return {
        ...state,
        tickerError: payload,
      };
    case ActionKind.SetSupplyError:
      return {
        ...state,
        supplyError: payload,
      };
    case ActionKind.SetBuyoutPriceError:
      return {
        ...state,
        buyoutPriceError: payload,
      };
    case ActionKind.SetBasketNameError:
      return {
        ...state,
        basketNameError: payload,
      };
    case ActionKind.SetSmallFractionPriceError:
      return {
        ...state,
        smallFractionPriceError: payload,
      };
    case ActionKind.ResetState:
      return { ...initialSidebarState };
    default:
      return state;
  }
};
