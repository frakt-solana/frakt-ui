import { FC, useState } from 'react';
import classNames from 'classnames';
import { sum } from 'ramda';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { Slider } from '../../../../components/Slider';
import Tooltip from '../../../../components/Tooltip';
import styles from './LongTermFields.module.scss';
import { BorrowNft } from '../../../../state/loans/types';

enum Risk {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

const getRisk = ({
  LTV,
  limits,
}: {
  LTV: number;
  limits: [number, number];
}): Risk => {
  const x = LTV / sum(limits);
  if (x < 0.33) return Risk.Low;
  if (x < 0.66) return Risk.Medium;
  return Risk.High;
};

interface ShortTermFields {
  nft: BorrowNft;
}

const LongTermFields: FC<ShortTermFields> = ({ nft }) => {
  const { valuation, priceBased } = nft;

  const { borrowAPRPercents, ltvPercents } = priceBased;

  const [LTV, setLTV] = useState<number>(10);

  const marks = {
    10: '10%',
    [ltvPercents]: `${ltvPercents}%`,
  };

  const liquidationPrice = Number(valuation) * (LTV / 100);
  const mintingFee = liquidationPrice * 0.01;
  const loanValue = Number(valuation) * (LTV / 100) - mintingFee;

  const risk = getRisk({ LTV, limits: [10, ltvPercents] });

  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.sliderWrapper}>
        <p className={styles.sliderLabel}>loan to value: {LTV}%</p>
        <Slider
          marks={marks}
          className={styles.slider}
          value={LTV}
          step={1}
          setValue={setLTV}
          min={10}
          max={ltvPercents}
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
            [styles.highLoanRisk]: risk === Risk.High,
            [styles.mediumLoanRisk]: risk === Risk.Medium,
            [styles.lowLoanRisk]: risk === Risk.Low,
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
        <p className={styles.staticValueData}>{borrowAPRPercents}%</p>
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
