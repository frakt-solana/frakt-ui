import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch } from 'react-redux';

import { useConfirmModal } from '../../../../components/ConfirmModal';
import { useLoadingModal } from '../../../../components/LoadingModal';
import { useConnection } from '../../../../hooks';
import { userTokensActions } from '../../../../state/userTokens/actions';
import { proposeLoan } from '../../../../utils/loans';
import { BorrowNft } from '../../../../state/loans/types';
import { useEffect, useState } from 'react';
import { loansActions } from '../../../../state/loans/actions';

export enum FormFieldTypes {
  SHORT_TERM_FIELD = 'shortTermField',
  LONG_TERM_FIELD = 'longTermField',
}

const getConfirmModalText = (nft: BorrowNft, isPriceBased = false) => {
  const { name, timeBased } = nft;

  const confirmShortTermText = `You are about to use ${name} as collateral for an instant loan of ${timeBased.repayValue} SOL (incl. interest rate if applicable) that you commit to repay in full within ${timeBased.returnPeriodDays} days. Proceed?`;
  const confirmLongTermText = `long term text ...`;

  return isPriceBased ? confirmLongTermText : confirmShortTermText;
};

type UseBorrowForm = (props: {
  onDeselect?: () => void;
  selectedNft?: BorrowNft;
}) => {
  openConfirmModal: () => void;
  confirmModalVisible: boolean;
  closeConfirmModal: () => void;
  loadingModalVisible: boolean;
  closeLoadingModal: () => void;
  onSubmit: (nft: BorrowNft) => void;
  formField: FormFieldTypes;
  setFormField: (nextFormField: FormFieldTypes) => void;
  priceBasedLTV: number;
  setPriceBasedLTV: (nextValue: number) => void;
  confirmText: string;
  priceBasedDisabled: boolean;
};

export const useBorrowForm: UseBorrowForm = ({ onDeselect, selectedNft }) => {
  const wallet = useWallet();
  const dispatch = useDispatch();
  const connection = useConnection();

  const [formField, setFormField] = useState<FormFieldTypes>(
    FormFieldTypes.LONG_TERM_FIELD,
  );

  const [priceBasedLTV, setPriceBasedLTV] = useState<number>(0);

  useEffect(() => {
    if (!selectedNft?.priceBased) {
      setFormField(FormFieldTypes.SHORT_TERM_FIELD);
    } else {
      setFormField(FormFieldTypes.LONG_TERM_FIELD);
    }
  }, [selectedNft]);

  useEffect(() => {
    setPriceBasedLTV(0);
  }, [selectedNft]);

  const {
    visible: confirmModalVisible,
    open: openConfirmModal,
    close: closeConfirmModal,
  } = useConfirmModal();

  const {
    visible: loadingModalVisible,
    close: closeLoadingModal,
    open: openLoadingModal,
  } = useLoadingModal();

  const removeTokenOptimistic = (mint: string) => {
    dispatch(loansActions.addHiddenBorrowNftMint(mint));
    dispatch(userTokensActions.removeTokenOptimistic([mint]));
  };

  const onSubmit = async (nft: BorrowNft) => {
    try {
      closeConfirmModal();
      openLoadingModal();

      const result = await proposeLoan({
        nftMint: nft?.mint,
        connection,
        wallet,
        valuation: parseFloat(nft?.valuation),
        isPriceBased: formField === FormFieldTypes.LONG_TERM_FIELD,
        loanToValue:
          formField === FormFieldTypes.LONG_TERM_FIELD
            ? priceBasedLTV
            : nft.timeBased.ltvPercents,
      });

      if (!result) {
        throw new Error('Loan proposing failed');
      }

      removeTokenOptimistic(nft.mint);
      onDeselect?.();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeConfirmModal();
      closeLoadingModal();
    }
  };

  const confirmText = getConfirmModalText(
    selectedNft,
    formField === FormFieldTypes.LONG_TERM_FIELD,
  );

  return {
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
    onSubmit,
    formField,
    setFormField,
    priceBasedLTV,
    setPriceBasedLTV,
    confirmText,
    priceBasedDisabled: !selectedNft?.priceBased,
  };
};
