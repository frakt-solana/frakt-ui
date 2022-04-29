import { FC } from 'react';
import { Radio as RadioAntd, Form } from 'antd';
import { Controller } from 'react-hook-form';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import { LoadingModal } from '../../../../components/LoadingModal';
import { LongTermForm } from '../LongTermForm/LongTermForm';
import { UserNFT } from '../../../../contexts/userTokens';
import { Radio } from '../../../../components/Radio';
import Button from '../../../../components/Button';
import styles from './BorrowForms.module.scss';
import ShortTermForm from '../ShortTermForm';
import {
  SelectControlsNames,
  StatusRadioNames,
  STATUS_VALUES,
  useBorrowForm,
} from './hooks';

interface BorrowFormsProps {
  selectedNft?: UserNFT[];
  ltvPrice?: number;
  onCloseSidebar?: () => void;
}

export const BorrowForms: FC<BorrowFormsProps> = ({
  selectedNft,
  ltvPrice,
  onCloseSidebar,
}) => {
  const {
    form,
    formControl,
    formStatus,
    openConfirmModal,
    confirmModalVisible,
    closeConfirmModal,
    returnPeriod,
    txnModalVisible,
    onTxnModalCancel,
    onSubmit,
  } = useBorrowForm(onCloseSidebar);

  const nameSelectedNft = selectedNft[0]?.metadata.name;
  const loanPeriod = returnPeriod.value;

  const confirmText = `You are about to use your ${nameSelectedNft} as collateral in loan ${
    formStatus === StatusRadioNames.SHORT_TERM_FORM
      ? `that you claim to return in ${loanPeriod} days`
      : ''
  } and repay is ${ltvPrice?.toFixed(3)} SOL. Want to proceed?`;

  return (
    <>
      <div className={styles.details}>
        <Form form={form} autoComplete="off">
          <p className={styles.detailsTitle}>Loan settings</p>
          <div className={styles.fieldWrapper}>
            <RadioAntd.Group className={styles.sidebarList} value={formStatus}>
              <div className={styles.sidebarList}>
                <Controller
                  control={formControl}
                  name={SelectControlsNames.SHOW_FORM_STATUS}
                  render={({ field: { onChange, value, ref, ...field } }) => (
                    <RadioAntd.Group
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className={styles.sidebarListItem}
                    >
                      {STATUS_VALUES.map(({ label, value, disabled }) => (
                        <div key={value}>
                          <Radio
                            value={value}
                            label={label}
                            disabled={disabled}
                            {...field}
                          />
                        </div>
                      ))}
                    </RadioAntd.Group>
                  )}
                />
              </div>
            </RadioAntd.Group>
            {formStatus === StatusRadioNames.LONG_TERM_FORM && <LongTermForm />}
            {formStatus === StatusRadioNames.SHORT_TERM_FORM && (
              <ShortTermForm />
            )}
          </div>
        </Form>
      </div>
      <div className={styles.continueBtnContainer}>
        <Button
          onClick={openConfirmModal}
          type="alternative"
          className={styles.continueBtn}
        >
          Borrow
        </Button>
      </div>
      <ConfirmModal
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onSubmit={() => onSubmit(selectedNft[0])}
        subtitle={confirmText}
      />
      <LoadingModal
        subtitle="In order to transfer the NFT/s approval is needed."
        visible={txnModalVisible}
        onCancel={onTxnModalCancel}
        className={styles.modal}
      />
    </>
  );
};
