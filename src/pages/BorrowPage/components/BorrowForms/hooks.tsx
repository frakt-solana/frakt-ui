import { Dispatch, SetStateAction, useState } from 'react';
import { Control, useForm } from 'react-hook-form';
import { Form, FormInstance } from 'antd';

import { useConfirmModal } from '../../../../components/ConfirmModal';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { UserNFT, useUserTokens } from '../../../../contexts/userTokens';
import { proposeLoan } from '../../../../contexts/loans';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

interface FormValues {
  LTV: string;
  period: string;
}

interface Option {
  label: JSX.Element | string;
  value: unknown;
}

interface OptionForm {
  label: string;
  value: string;
  disabled?: boolean;
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
  SHORT_TERM_FORM = 'shortTermForm',
  LONG_TERM_FORM = 'longTermForm',
}

export const useBorrowForm = (
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
  const wallet = useWallet();
  const { connection } = useConnection();

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

  const { removeTokenOptimistic } = useUserTokens();

  const returnPeriod = watch(SelectControlsNames.RETURN_PERIOD_VALUES);
  const ltvValues = watch(SelectControlsNames.LTV_VALUES);
  const formStatus = watch(SelectControlsNames.SHOW_FORM_STATUS);

  const onSubmit = async (nft: UserNFT) => {
    try {
      setTxnModalVisible(true);

      const result = await proposeLoan({
        nftMint: nft?.mint,
        connection,
        wallet,
      });

      if (!result) {
        throw new Error('Loan proposing failed');
      }

      removeTokenOptimistic([nft.mint]);
      onCloseSidebar();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeConfirmModal();
      setTxnModalVisible(false);
    }
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

export const STATUS_VALUES: OptionForm[] = [
  {
    label: 'Short-term',
    value: StatusRadioNames.SHORT_TERM_FORM,
  },
  {
    label: 'Long-term',
    value: StatusRadioNames.LONG_TERM_FORM,
    disabled: true,
  },
];
