import { Dispatch, SetStateAction, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';
import { Form, FormInstance } from 'antd';

import { useConfirmModal } from '../../../components/ConfirmModal';
import { UserNFT } from '../../../contexts/userTokens';
import { SortValue } from '../../VaultsPage/model';
import { createLoan } from '../../../utils/loans';

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

export const useBorrowForm = (
  selectedNft: UserNFT[],
): {
  confirmModalVisible: boolean;
  closeConfirmModalRaw: () => void;
  formControl: Control<FormFieldValues>;
  onSubmit: () => void;
  openConfirmModal: () => void;
  form: FormInstance<FormValues>;
  returnPeriod: SortValue;
  ltvValues: SortValue;
  txnModalVisible: boolean;
  onTxnModalCancel: () => void;
  activeLine: string;
  setActiveLine: Dispatch<SetStateAction<string>>;
  onCreateLoan: () => Promise<void>;
} => {
  const [txnModalVisible, setTxnModalVisible] = useState<boolean>(false);
  const [activeLine, setActiveLine] = useState<string>('');
  const [form] = Form.useForm<FormValues>();
  const { connection } = useConnection();
  const wallet = useWallet();

  const { control, watch } = useForm({
    defaultValues: {
      [SelectControlsNames.RETURN_PERIOD_VALUES]: RETURN_PERIOD_VALUES[0],
      [SelectControlsNames.LTV_VALUES]: LTV_VALUES[0],
    },
  });

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModalRaw,
  } = useConfirmModal();

  const returnPeriod = watch(SelectControlsNames.RETURN_PERIOD_VALUES);
  const ltvValues = watch(SelectControlsNames.LTV_VALUES);

  const onSubmit = (): void => {
    setTxnModalVisible(true);
  };

  const onTxnModalCancel = (): void => {
    setTxnModalVisible(false);
  };

  const onCreateLoan = async (): Promise<void> => {
    await createLoan({ connection, wallet, nft: selectedNft[0] });
  };

  return {
    confirmModalVisible,
    returnPeriod,
    ltvValues,
    closeConfirmModalRaw,
    formControl: control,
    onSubmit,
    form,
    txnModalVisible,
    openConfirmModal,
    onTxnModalCancel,
    activeLine,
    setActiveLine,
    onCreateLoan,
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
