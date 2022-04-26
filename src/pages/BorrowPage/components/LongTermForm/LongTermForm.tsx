import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Form } from 'antd';

import { SelectControlsNames, useBorrowForm } from '../BorrowForms';
import Slider from '../../../../components/Slider';
import styles from './LongTermForm.module.scss';
import { SOL_TOKEN } from '../../../../utils';

export const LongTermForm: FC = () => {
  const { formControl, ltvValues } = useBorrowForm();

  const sliderMarks = {
    0: '0%',
    50: '50%',
  };

  return (
    <>
      <div className={styles.fieldWrapper}>
        <Form.Item name={SelectControlsNames.LTV_VALUES}>
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
        <Form.Item name={SelectControlsNames.LTV_VALUES}>
          <p className={styles.formTitle}>loan to value: {ltvValues}%</p>
          <Controller
            control={formControl}
            name={SelectControlsNames.LTV_VALUES}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <Slider
                value={ltvValues}
                tipFormatter={(value) => `${value}%`}
                onChange={onChange}
                className={styles.slider}
                marks={sliderMarks}
                step={1}
                max={50}
                disabled
              />
            )}
          />
        </Form.Item>
      </div>
    </>
  );
};
