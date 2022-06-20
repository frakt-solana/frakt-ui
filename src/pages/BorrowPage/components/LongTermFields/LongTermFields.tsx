import { FC, useState } from 'react';
import classNames from 'classnames';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { Slider } from '../../../../components/Slider';
import Tooltip from '../../../../components/Tooltip';
import styles from './LongTermFields.module.scss';

interface ShortTermFields {
  loanValue?: number;
  valuation?: string;
  mintingFee?: number;
  liquidationPrice?: number;
  ltvPercents?: number;
}

const LongTermFields: FC<ShortTermFields> = ({
  loanValue,
  valuation,
  mintingFee,
  liquidationPrice,
  ltvPercents,
}) => {
  const [persentLoanToValue, setPersentLoanToValue] = useState<number>(0);

  const marks = {
    10: '10%',
    50: '50%',
  };

  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.sliderWrapper}>
        <p className={styles.sliderLabel}>
          loan to value: {persentLoanToValue || 10}%
        </p>
        <Slider
          marks={marks}
          className={styles.slider}
          value={persentLoanToValue}
          step={1}
          setValue={(value) => setPersentLoanToValue(value)}
          min={10}
          max={50}
        />
      </div>

      <div
        className={styles.staticValue}
        style={{ marginBottom: 10, paddingTop: 20 }}
      >
        <p className={styles.staticValueTitle}>Valuation</p>
        <p className={styles.staticValueData}>{valuation} SOL</p>
      </div>

      <div className={styles.staticValue}>
        <p className={styles.staticValueTitle}>liquidation price</p>
        <p
          className={classNames(styles.staticValueData, {
            [styles.highLoanRisk]: ltvPercents < 30,
            [styles.mediumLoanRisk]: ltvPercents >= 30 && ltvPercents < 60,
            [styles.lowLoanRisk]: ltvPercents >= 60 && ltvPercents <= 100,
          })}
        >
          {liquidationPrice.toFixed(3)} SOL
          <Tooltip
            placement="bottom"
            trigger="hover"
            overlay="The closer to the valuation, the higher the chance of liquidation"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </p>
      </div>

      <div
        className={classNames(styles.staticValue)}
        style={{ marginTop: 20, marginBottom: 10 }}
      >
        <p className={styles.staticValueTitle}>Borrow APY</p>
        <p className={styles.staticValueData}>12.140 %</p>
      </div>

      <div className={styles.staticValue} style={{ marginBottom: 10 }}>
        <p className={styles.staticValueTitle}>Minting Fee</p>
        <p className={styles.staticValueData}>{mintingFee.toFixed(3)} SOL</p>
      </div>

      <div
        className={classNames(styles.staticValue, styles.staticValueAccent)}
        style={{ marginBottom: 30 }}
      >
        <p className={styles.staticValueTitle}>Loan value</p>
        <p className={styles.staticValueData}>{loanValue.toFixed(3)} SOL</p>
      </div>
    </div>
  );
};

export default LongTermFields;
