export type NftSortValue = {
  label: JSX.Element;
  value: string;
};

export enum FilterFormInputsNames {
  SORT = 'sort',
}

export type FilterFormFieldsValues = {
  [FilterFormInputsNames.SORT]: NftSortValue;
};
