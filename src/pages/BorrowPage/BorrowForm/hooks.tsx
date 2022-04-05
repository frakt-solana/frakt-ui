import { Dispatch, SetStateAction, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Control, useForm } from 'react-hook-form';
import { Form, FormInstance } from 'antd';

import { useConfirmModal } from '../../../components/ConfirmModal';
import { UserNFT, useUserTokens } from '../../../contexts/userTokens';
import { createLoan } from '../../../utils/loans';
import { useLoadingModal } from '../../../components/LoadingModal';

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
  selectedNft?: UserNFT[],
  onCloseSidebar?: () => void,
): {
  confirmModalVisible: boolean;
  closeConfirmModal: () => void;
  formControl: Control<FormFieldValues>;
  onSubmit: (nft: UserNFT) => void;
  openConfirmModal: () => void;
  form: FormInstance<FormValues>;
  returnPeriod: Option;
  ltvValues: Option;
  txnModalVisible: boolean;
  onTxnModalCancel: () => void;
  activeLine: string;
  setActiveLine: Dispatch<SetStateAction<string>>;
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
} => {
  const [txnModalVisible, setTxnModalVisible] = useState<boolean>(false);
  const [activeLine, setActiveLine] = useState<string>('');
  const [form] = Form.useForm<FormValues>();
  const { connection } = useConnection();
  const wallet = useWallet();

  const { removeTokenOptimistic } = useUserTokens();

  const { control, watch } = useForm({
    defaultValues: {
      [SelectControlsNames.RETURN_PERIOD_VALUES]: RETURN_PERIOD_VALUES[0],
      [SelectControlsNames.LTV_VALUES]: LTV_VALUES[0],
    },
  });

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const { visible: loadingModalVisible, close: closeLoadingModal } =
    useLoadingModal();

  const returnPeriod = watch(SelectControlsNames.RETURN_PERIOD_VALUES);
  const ltvValues = watch(SelectControlsNames.LTV_VALUES);

  const onSubmit = async (nft: UserNFT): Promise<void> => {
    setTxnModalVisible(true);
    const response = await createLoan({
      connection,
      wallet,
      nft: selectedNft[0],
    });
    if (response) {
      removeTokenOptimistic([nft.mint]);
      onCloseSidebar();
    }
    closeConfirmModal();
    setTxnModalVisible(false);
  };

  const onTxnModalCancel = (): void => {
    setTxnModalVisible(false);
  };

  return {
    confirmModalVisible,
    returnPeriod,
    ltvValues,
    closeConfirmModal,
    formControl: control,
    onSubmit,
    form,
    txnModalVisible,
    openConfirmModal,
    onTxnModalCancel,
    activeLine,
    setActiveLine,
    loadingModalVisible,
    closeLoadingModal,
  };
};

export const RETURN_PERIOD_VALUES: Option[] = [
  {
    label: <span>7 Days</span>,
    value: '7',
  },
];

export const LTV_VALUES: Option[] = [
  {
    label: <span>30%</span>,
    value: '30',
  },
];
