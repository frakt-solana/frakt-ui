import { useState } from 'react';
import { Form, FormInstance } from 'antd';
import { Control, useForm } from 'react-hook-form';

import { SortValue } from '../../VaultsPage/model';

interface FormValues {
  LTV: string;
  period: string;
}

interface Option {
  label: JSX.Element | string;
  value: unknown;
}

export enum SelectControlsNames {
  LTV_VALUES = 'LTV',
  RETURN_PERIOD_VALUES = 'returnPeriod',
}

export type FormFieldValues = {
  [SelectControlsNames.LTV_VALUES]: Option;
  [SelectControlsNames.RETURN_PERIOD_VALUES]: Option;
};

export const useBorrowForm = (): {
  visible: boolean;
  onConfirmModalCancel: () => void;
  formControl: Control<FormFieldValues>;
  onSubmit: () => void;
  form: FormInstance<FormValues>;
  returnPeriod: SortValue;
  ltvValues: SortValue;
} => {
  const [visible, setVisible] = useState<boolean>(false);
  const [form] = Form.useForm<FormValues>();
  const { control, watch } = useForm({
    defaultValues: {
      [SelectControlsNames.RETURN_PERIOD_VALUES]: RETURN_PERIOD_VALUES[0],
      [SelectControlsNames.LTV_VALUES]: LTV_VALUES[0],
    },
  });

  const returnPeriod = watch(SelectControlsNames.RETURN_PERIOD_VALUES);
  const ltvValues = watch(SelectControlsNames.LTV_VALUES);

  const onConfirmModalCancel = (): void => {
    setVisible(false);
  };

  const onSubmit = (): void => {
    setVisible(true);
  };

  return {
    visible,
    returnPeriod,
    ltvValues,
    onConfirmModalCancel,
    formControl: control,
    onSubmit,
    form,
  };
};

export const RETURN_PERIOD_VALUES: SortValue[] = [
  {
    label: <span>7 Days</span>,
    value: '7',
  },
  {
    label: <span>10 Days</span>,
    value: '10',
  },
];

export const LTV_VALUES: SortValue[] = [
  {
    label: <span>30%</span>,
    value: '30',
  },
  {
    label: <span>50%</span>,
    value: '50',
  },
  {
    label: <span>100%</span>,
    value: '100',
  },
];
