import { FC } from 'react';
import classNames from 'classnames';
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
  const riskPercent = (LTV - limits[0]) / (limits[1] - limits[0]);

  if (riskPercent <= 0.5) return Risk.Low;
  if (riskPercent < 0.875) return Risk.Medium;
  return Risk.High;
};

interface ShortTermFields {
  nft: BorrowNft;
  ltv: number;
  setLtv: (nextValue: number) => void;
}

const LongTermFields: FC<ShortTermFields> = ({ nft, ltv, setLtv }) => {
  const { valuation, priceBased } = nft;

  const { borrowAPRPercents, ltvPercents, collaterizationRate } = priceBased;

  const marks = {
    10: '10%',
    [ltvPercents]: `${ltvPercents}%`,
  };

  const value = ltv ? ltv : (ltvPercents + 10) / 2;

  const loanValue = Number(valuation) * (value / 100);
  const mintingFee = loanValue * 0.01;

  const liquidationPrice = loanValue + loanValue * (collaterizationRate / 100);

  const risk = getRisk({ LTV: value, limits: [10, ltvPercents] });

  return (
    <div className={styles.fieldWrapper}>
      <div className={styles.sliderWrapper}>
        <p className={styles.sliderLabel}>
          loan to value: {value}%{' '}
          <Tooltip
            placement="bottom"
            trigger="hover"
            overlay="Ratio between debt and deposited NFT valuation. The higher it is, the riskier the loan"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </p>
        <Slider
          marks={marks}
          className={styles.slider}
          value={value}
          step={1}
          setValue={setLtv}
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
            overlay="How much the NFT price needs to drop for your loan to get liquidated"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </p>
      </div>

      <div
        className={classNames(styles.staticValue)}
        style={{ marginTop: 20, marginBottom: 10 }}
      >
        <p className={styles.staticValueTitle}>Interest rate</p>
        <p className={styles.staticValueData}>
          {borrowAPRPercents.toFixed(0)}%
          <Tooltip
            placement="bottom"
            trigger="hover"
            overlay="The current yearly interest rate paid by borrowers"
          >
            <QuestionCircleOutlined className={styles.questionIcon} />
          </Tooltip>
        </p>
      </div>

      <div className={styles.staticValue} style={{ marginBottom: 10 }}>
        <p className={styles.staticValueTitle}>Fee</p>
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
