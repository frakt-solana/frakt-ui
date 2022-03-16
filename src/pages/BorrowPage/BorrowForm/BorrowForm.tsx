import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Form } from 'antd';

import { LoadingModal } from '../../../components/LoadingModal';
import { UserNFT } from '../../../contexts/userTokens';
import { Select } from '../../../components/Select';
import Button from '../../../components/Button';
import { SOL_TOKEN } from '../../../utils';
import styles from './BorrowForm.module.scss';

import {
  useBorrowForm,
  SelectControlsNames,
  LTV_VALUES,
  RETURN_PERIOD_VALUES,
} from './index';
import ConfirmModal from '../../../components/ConfirmModal';
import classNames from 'classnames';

interface BorrowFormProps {
  selectedNft: UserNFT[];
}

export const BorrowForm: FC<BorrowFormProps> = ({ selectedNft }) => {
  const {
    form,
    onSubmit,
    formControl,
    confirmModalVisible,
    closeConfirmModalRaw,
    openConfirmModal,
    returnPeriod,
    ltvValues,
    txnModalVisible,
    onTxnModalCancel,
    activeLine,
    setActiveLine,
  } = useBorrowForm();

  return (
    <>
      <div className={styles.details}>
        <Form form={form} autoComplete="off">
          <p className={styles.detailsTitle}>Borrow settings</p>
          <div className={styles.fieldWrapper}>
            <Form.Item name={SelectControlsNames.LTV_VALUES} validateFirst>
              <div className={styles.formContent}>
                <p className={styles.formTitle}>Token</p>
                <div className={styles.tokenInfo}>
                  <p className={styles.tokenName}>{SOL_TOKEN.symbol}</p>
                  <img className={styles.tokenIcon} src={SOL_TOKEN.logoURI} />
                </div>
              </div>
            </Form.Item>
            <div className={styles.line}></div>
          </div>
          <div className={styles.fieldWrapper}>
            <Form.Item name={SelectControlsNames.LTV_VALUES} validateFirst>
              <div className={styles.formContent}>
                <p className={styles.formTitle}>LTV</p>
                <Controller
                  control={formControl}
                  name={SelectControlsNames.LTV_VALUES}
                  rules={{ required: true }}
                  render={({ field: { ref, ...field } }) => (
                    <Select
                      className={styles.select}
                      name={SelectControlsNames.LTV_VALUES}
                      options={LTV_VALUES}
                      onFocus={() =>
                        setActiveLine(SelectControlsNames.LTV_VALUES)
                      }
                      {...field}
                    />
                  )}
                />
              </div>
            </Form.Item>
            <div
              className={classNames(
                activeLine === SelectControlsNames.LTV_VALUES
                  ? styles.activeLine
                  : styles.line,
              )}
            />
          </div>
          <div className={styles.fieldWrapperDouble}>
            <Form.Item name={SelectControlsNames.RETURN_PERIOD_VALUES}>
              <div className={styles.formContent}>
                <p className={styles.formTitle}>Return period</p>
                <Controller
                  control={formControl}
                  name={SelectControlsNames.RETURN_PERIOD_VALUES}
                  rules={{ required: true }}
                  render={({ field: { ref, ...field } }) => (
                    <Select
                      className={styles.select}
                      name={SelectControlsNames.RETURN_PERIOD_VALUES}
                      options={RETURN_PERIOD_VALUES}
                      onFocus={() =>
                        setActiveLine(SelectControlsNames.RETURN_PERIOD_VALUES)
                      }
                      {...field}
                    />
                  )}
                />
              </div>
            </Form.Item>
            <div
              className={classNames(
                activeLine === SelectControlsNames.RETURN_PERIOD_VALUES
                  ? styles.activeLine
                  : styles.line,
              )}
            />
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
        onCancel={closeConfirmModalRaw}
        onSubmit={onSubmit}
        subtitle={` You are about to use your ${selectedNft[0].metadata.name} as collateral in ${ltvValues.value} SOL
        loan that you claim to return in ${returnPeriod.value} days. Want to proceed?`}
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
