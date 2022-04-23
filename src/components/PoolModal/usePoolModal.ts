import { useEffect } from 'react';
import { Control, useForm } from 'react-hook-form';

export enum InputControlsNames {
  DEPOSIT_VALUE = 'depositValue',
}

export enum TabsNames {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export type FormFieldValues = {
  [InputControlsNames.DEPOSIT_VALUE]: number;
};

export const usePoolModal = (): {
  depositValue: number;
  formControl: Control<FormFieldValues>;
} => {
  const { control, watch, register, setValue } = useForm({
    defaultValues: {
      [InputControlsNames.DEPOSIT_VALUE]: 0,
    },
  });

  const { depositValue } = watch();

  useEffect(() => {
    register(InputControlsNames.DEPOSIT_VALUE);
  }, [register]);

  return { depositValue, formControl: control };
};
