import React, { useState } from 'react';
import BN from 'bn.js';
import { Form } from 'antd';

import styles from './styles.module.scss';
import { Input } from '../../../../components/Input';
import NumericInput from '../../../../components/NumericInput';
import Button from '../../../../components/Button';
import { validators } from '../../../../utils/validators';
import { useTokenListContext } from '../../../../contexts/TokenList';
import { FraktionPrice } from './FraktionPrice';
import {
  TOKEN_FIELD_CURRENCY,
  TokenFieldForm,
} from '../../../../components/TokenField';

interface DetailsFormProps {
  onSubmit?: (values: FormValues) => void;
}

interface FormValues {
  ticker: string;
  pricePerFraktion: number;
  supply: string;
  vaultName: string;
}

const DEFAULT_VALUES: Omit<FormValues, 'pricePerFraktion'> = {
  ticker: '',
  supply: '',
  vaultName: '',
};

const calculatePricePerFraktion = (
  buyoutPrice: string,
  supply: string,
): number => {
  return buyoutPrice && supply && Number(buyoutPrice) / Number(supply);
};

export const DetailsForm: React.FC<DetailsFormProps> = ({ onSubmit }) => {
  const [, setForceUpdate] = useState(1);
  const { tokensList } = useTokenListContext();
  const [form] = Form.useForm<Omit<FormValues, 'pricePerFraktion'>>();

  const forceUpdate = () => setForceUpdate((val) => val + 1);

  const pricePerFraktionError = validators.validateFractionPrice(
    form.getFieldValue('buyoutPrice'),
    form.getFieldValue('supply'),
  );

  const pricePerFraktion = calculatePricePerFraktion(
    form.getFieldValue('buyoutPrice'),
    form.getFieldValue('supply'),
  );

  return (
    <>
      <div className={styles.details}>
        <Form
          form={form}
          autoComplete="off"
          layout="vertical"
          initialValues={DEFAULT_VALUES}
          onFieldsChange={forceUpdate}
          onFinish={(values) => onSubmit({ ...values, pricePerFraktion })}
        >
          <p className={styles.detailsTitle}>Vault details</p>
          <div className={styles.fieldWrapper}>
            <Form.Item
              rules={[{ validator: validators.vaultName(tokensList) }]}
              label="Vault name"
              name="vaultName"
              help=""
            >
              <Input placeholder="Coolest name" disableNumbers disableSymbols />
            </Form.Item>
          </div>
          <div className={styles.fieldWrapperDouble}>
            <Form.Item
              validateFirst
              rules={[{ validator: validators.supply }]}
              label="Supply"
              name="supply"
              help=""
            >
              <NumericInput
                placeholder="1000"
                positiveOnly
                integerOnly
                maxLength={9}
              />
            </Form.Item>
            <Form.Item
              label="Ticker"
              name="ticker"
              help=""
              rules={[{ validator: validators.ticker(tokensList) }]}
            >
              <Input
                placeholder="XXX"
                disableNumbers
                disableSymbols
                maxLength={4}
              />
            </Form.Item>
          </div>
          {
            <FraktionPrice
              pricePerFrktBN={
                pricePerFraktion ? new BN(pricePerFraktion * 10e5) : null
              }
              error={pricePerFraktionError}
            />
          }
          <Form.Item
            label="Start bid"
            name="buyoutPrice"
            getValueFromEvent={({ amount }) => amount}
            rules={[{ validator: validators.buyoutPrice }]}
            help=""
          >
            <TokenFieldForm
              currentToken={TOKEN_FIELD_CURRENCY.SOL}
              maxLength={5}
            />
          </Form.Item>
          {form.getFieldsError().map((el, idx) =>
            el?.errors?.[0] ? (
              <p className={styles.err} key={idx}>
                {el?.errors?.[0]}
              </p>
            ) : null,
          )}
          {pricePerFraktionError && (
            <p className={styles.err}>{pricePerFraktionError}</p>
          )}
        </Form>
      </div>
      <div className={styles.continueBtnContainer}>
        <p className={styles.feeMessage}>
          * Fraktionalization fees:
          <br />
          0.5% of buyout price [min. 0.5 SOL]
        </p>
        <Button
          onClick={form.submit}
          type="alternative"
          disabled={!!pricePerFraktionError}
          className={styles.continueBtn}
        >
          Continue
        </Button>
      </div>
    </>
  );
};
