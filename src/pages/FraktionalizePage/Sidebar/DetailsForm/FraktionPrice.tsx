import React from 'react';
import styles from './styles.module.scss';
import { BuyoutField } from './BuyoutField';
import { UserNFT } from '../../../../contexts/userTokens';
import { Form } from 'antd';
import { Input } from '../../../../components/Input';
import NumericInput from '../../../../components/NumericInput';
import Button from '../../../../components/Button';
import { shortBigNumber } from '../../../../utils';
import BN from 'bn.js';

interface FraktionPriceProps {
  pricePerFrktBN: BN;
  error: string;
}

export const FraktionPrice: React.FC<FraktionPriceProps> = ({
  pricePerFrktBN,
  error,
}) => {
  return (
    <div className={styles.fraktionPrice}>
      Fraktion price
      <span className={styles.line} />
      {!error && (
        <>
          {pricePerFrktBN ? shortBigNumber(pricePerFrktBN, 2, 6) : '0.00'} SOL
        </>
      )}
      {error && 'Error'}
    </div>
  );
};
