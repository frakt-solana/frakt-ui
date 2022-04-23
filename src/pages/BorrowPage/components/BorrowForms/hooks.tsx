import { Dispatch, SetStateAction, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { Form, FormInstance } from 'antd';

import { useConfirmModal } from '../../../../components/ConfirmModal';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { UserNFT } from '../../../../contexts/userTokens';

interface FormValues {
  LTV: string;
  period: string;
}

interface Option {
  label: JSX.Element | string;
  value: unknown;
}

interface OptionStatus {
  label: string;
  value: string;
}

export enum SelectControlsNames {
  LTV_VALUES = 'LTV',
  RETURN_PERIOD_VALUES = 'returnPeriod',
  SHOW_FORM_STATUS = 'showFormStatus',
}

export type FormFieldValues = {
  [SelectControlsNames.LTV_VALUES]: number;
  [SelectControlsNames.RETURN_PERIOD_VALUES]: Option;
  [SelectControlsNames.SHOW_FORM_STATUS]: string;
};

export enum StatusRadioNames {
  SHOW_SHORT_SIDEBAR = 'showShortSidebar',
  SHOW_LONG_SIDEBAR = 'showLongSidebar',
}

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
  ltvValues: number;
  txnModalVisible: boolean;
  onTxnModalCancel: () => void;
  activeLine: string;
  setActiveLine: Dispatch<SetStateAction<string>>;
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  formStatus: string;
} => {
  const [txnModalVisible, setTxnModalVisible] = useState<boolean>(false);
  const [activeLine, setActiveLine] = useState<string>('');
  const [form] = Form.useForm<FormValues>();

  const { control, watch } = useForm({
    defaultValues: {
      [SelectControlsNames.RETURN_PERIOD_VALUES]: RETURN_PERIOD_VALUES[0],
      [SelectControlsNames.LTV_VALUES]: 0,
      [SelectControlsNames.SHOW_FORM_STATUS]: STATUS_VALUES[0].value,
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
  const formStatus = watch(SelectControlsNames.SHOW_FORM_STATUS);

  const onSubmit = (nft: UserNFT) => {
    setTxnModalVisible(true);
    // closeConfirmModal();
    // setTxnModalVisible(false);
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
    formStatus,
  };
};

export const RETURN_PERIOD_VALUES: Option[] = [
  {
    label: <span>7 Days</span>,
    value: '7',
  },
];

export const STATUS_VALUES: OptionStatus[] = [
  {
    label: 'Long-term',
    value: StatusRadioNames.SHOW_LONG_SIDEBAR,
  },
  {
    label: 'Short-term',
    value: StatusRadioNames.SHOW_SHORT_SIDEBAR,
  },
];
