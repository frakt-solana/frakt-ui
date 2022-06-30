export enum LiquidationsTabsNames {
  LIQUIDATIONS = 'liquidations',
  RAFFLES = 'raffles',
  GRACE = 'grace',
}

export enum LiquidationsListFormNames {
  SORT = 'sort',
  COLLECTIONS_SORT = 'collections',
}

export type LiquiditionsSortValue = {
  label: JSX.Element;
  value: string;
};

export enum FilterFormInputsNames {
  SORT = 'sort',
}

export type FilterFormFieldsValues = {
  [LiquidationsListFormNames.SORT]: LiquiditionsSortValue;
  [LiquidationsListFormNames.COLLECTIONS_SORT]: LiquiditionsSortValue;
};
