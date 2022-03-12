import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Form } from 'antd';

import ConfirmModal from '../../../components/ConfirmModal';
import { UserNFT } from '../../../contexts/userTokens';
import { Select } from '../../../components/Select';
import Button from '../../../components/Button';
import { SOL_TOKEN } from '../../../utils';
import styles from './styles.module.scss';
import {
  LTV_VALUES,
  RETURN_PERIOD_VALUES,
  SelectControlsNames,
  useBorrowForm,
} from './hooks';
import { LoadingModal } from '../../../components/LoadingModal';

interface BorrowFormProps {
  selectedNft: UserNFT[];
}

export const BorrowForm: FC<BorrowFormProps> = ({ selectedNft }) => {
  const {
    form,
    onSubmit,
    formControl,
    onConfirmModalCancel,
    visible,
    returnPeriod,
    ltvValues,
    txnModalVisible,
    onContinue,
    onTxnModalCancel,
  } = useBorrowForm();

  return (
    <>
      <div className={styles.details}>
        <Form form={form} autoComplete="off">
          <p className={styles.detailsTitle}>Lending settings</p>
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
                      valueContainerClassName={
                        styles.sortingSelectValueContainer
                      }
                      name={SelectControlsNames.LTV_VALUES}
                      options={LTV_VALUES}
                      {...field}
                    />
                  )}
                />
              </div>
            </Form.Item>
            <div className={styles.line}></div>
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
                      valueContainerClassName={
                        styles.sortingSelectValueContainer
                      }
                      name={SelectControlsNames.RETURN_PERIOD_VALUES}
                      options={RETURN_PERIOD_VALUES}
                      {...field}
                    />
                  )}
                />
              </div>
            </Form.Item>
            <div className={styles.line}></div>
          </div>
        </Form>
      </div>
      <div className={styles.continueBtnContainer}>
        <Button
          onClick={onContinue}
          type="alternative"
          className={styles.continueBtn}
        >
          Borrow
        </Button>
      </div>
      <ConfirmModal
        visible={visible}
        onCancel={onConfirmModalCancel}
        nftName={selectedNft[0].metadata.name}
        returnPeriod={returnPeriod.value}
        ltvPrice={ltvValues.value}
        onSubmit={onSubmit}
      />
      <LoadingModal
        subtitle="In order to transfer the NFT/s approval is needed."
        visible={txnModalVisible}
        onCancel={onTxnModalCancel}
        className={styles.modal}
        loaderSize="small"
      />
    </>
  );
};
