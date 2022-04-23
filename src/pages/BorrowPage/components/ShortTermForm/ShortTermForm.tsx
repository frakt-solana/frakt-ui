import { FC } from 'react';
import { Controller } from 'react-hook-form';
import classNames from 'classnames';
import { Form } from 'antd';

import { Select } from '../../../../components/Select';
import Slider from '../../../../components/Slider';
import styles from './ShortTermForm.module.scss';
import { SOL_TOKEN } from '../../../../utils';
import {
  RETURN_PERIOD_VALUES,
  SelectControlsNames,
  useBorrowForm,
} from '../BorrowForms';

export const ShortTermForm: FC = () => {
  const { formControl, activeLine, setActiveLine, ltvValues } = useBorrowForm();

  const sliderMarks = {
    0: '0%',
    50: '50%',
  };

  return (
    <>
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
                step={10}
                max={50}
              />
            )}
          />
        </Form.Item>
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
                  disabled
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
    </>
  );
};
