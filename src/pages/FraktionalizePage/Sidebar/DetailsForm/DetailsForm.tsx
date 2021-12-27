import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { Form } from 'antd';
import { Input } from '../../../../components/Input';
import NumericInput from '../../../../components/NumericInput';
import Button from '../../../../components/Button';
import {
  getConditionalValidator,
  validators,
} from '../../../../utils/validators';
import { useTokenListContext } from '../../../../contexts/TokenList';
import BN from 'bn.js';
import { FraktionPrice } from './FraktionPrice';
import {
  TOKEN_FIELD_CURRENCY,
  TokenFieldForm,
} from '../../../../components/TokenField';

interface DetailsProps {
  vaultName?: string;
  onSubmit?: (values: FormValues) => void;
  isBasket: boolean;
  isAuction: boolean;
}

interface FormValues {
  supply: string;
  ticker: string;
  buyoutPrice: string;
  pricePerFraktion: number;
  tickSize: string;
  startBid: string;
  basketName: string;
}

const DEFAULT_VALUES: Omit<FormValues, 'pricePerFraktion'> = {
  ticker: '',
  supply: '',
  buyoutPrice: '',
  tickSize: '',
  startBid: '',
  basketName: '',
};

const calculatePricePerFraktion = (
  buyoutPrice: string,
  supply: string,
): number => {
  return buyoutPrice && supply && Number(buyoutPrice) / Number(supply);
};

export const DetailsForm: React.FC<DetailsProps> = ({
  vaultName,
  isBasket,
  isAuction,
  onSubmit,
}) => {
  const [_, setForceUpdate] = useState(1); //eslint-disable-line
  const { tokenList } = useTokenListContext();
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

  useEffect(() => {
    if (!isAuction) {
      form.resetFields(['tickSize', 'startBid']);
      forceUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuction]);

  useEffect(() => {
    if (!isBasket) {
      form.resetFields(['basketName']);
      forceUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBasket]);

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
              rules={getConditionalValidator(isBasket, [
                { validator: validators.backetName(tokenList) },
              ])}
              label="Basket name"
              name="basketName"
              hidden={!isBasket}
              help=""
            >
              <Input placeholder="Coolest basket" />
            </Form.Item>
            {!isBasket && (
              <>
                <p className={styles.fieldLabel}>Name</p>
                <p className={styles.tokenName}>{vaultName}</p>
              </>
            )}
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
              rules={[{ validator: validators.ticker(tokenList) }]}
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
          {/* changed buy out price to start bid for auctions  */}
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
          <Form.Item
            getValueFromEvent={({ amount }) => amount}
            rules={getConditionalValidator(isAuction, [
              { validator: validators.buyoutPrice },
            ])}
            label="Start bid"
            name="startBid"
            help=""
            hidden={!isAuction}
          >
            <TokenFieldForm
              currentToken={TOKEN_FIELD_CURRENCY.SOL}
              maxLength={5}
            />
          </Form.Item>
          <Form.Item
            getValueFromEvent={({ amount }) => amount}
            rules={getConditionalValidator(isAuction, [
              { validator: validators.tickSize },
            ])}
            label="Tick size"
            name="tickSize"
            help=""
            hidden={!isAuction}
          >
            <TokenFieldForm currentToken={TOKEN_FIELD_CURRENCY.SOL} />
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
