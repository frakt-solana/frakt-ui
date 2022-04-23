import { FC } from 'react';
import { Radio as RadioAntd, Form } from 'antd';
import { Controller } from 'react-hook-form';

import { ConfirmModal } from '../../../../components/ConfirmModal';
import styles from './BorrowForms.module.scss';
import { Radio } from '../../../../components/Radio';
import { LongTermForm } from '../LongTermForm/LongTermForm';
import { UserNFT } from '../../../../contexts/userTokens';
import Button from '../../../../components/Button';
import ShortTermForm from '../ShortTermForm';
import {
  SelectControlsNames,
  StatusRadioNames,
  STATUS_VALUES,
  useBorrowForm,
} from './hooks';
import { LoadingModal } from '../../../../components/LoadingModal';

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
  } = useBorrowForm(selectedNft, onCloseSidebar);

  const confirmTextForShortTerm = `You are about to use your ${
    selectedNft[0]?.metadata.name
  } as collateral in loan that you claim to return in ${
    returnPeriod.value
  } days and repay is ${ltvPrice?.toFixed(3)} SOL. Want to proceed?`;

  const confirmTextForLongTerm = `You are about to use your ${
    selectedNft[0]?.metadata.name
  } as collateral in loan  and repay is ${ltvPrice?.toFixed(
    3,
  )} SOL. Want to proceed?`;

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
                      {STATUS_VALUES.map(({ label, value }) => (
                        <div key={value}>
                          <Radio value={value} label={label} {...field} />
                        </div>
                      ))}
                    </RadioAntd.Group>
                  )}
                />
              </div>
            </RadioAntd.Group>
            {formStatus === StatusRadioNames.SHOW_LONG_SIDEBAR && (
              <LongTermForm />
            )}
            {formStatus === StatusRadioNames.SHOW_SHORT_SIDEBAR && (
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
        subtitle={
          formStatus === StatusRadioNames.SHOW_LONG_SIDEBAR
            ? confirmTextForLongTerm
            : confirmTextForShortTerm
        }
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
