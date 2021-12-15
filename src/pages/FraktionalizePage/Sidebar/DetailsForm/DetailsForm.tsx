import React, { useState } from 'react';
import styles from './styles.module.scss';
import { BuyoutField } from './BuyoutField';
import { UserNFT } from '../../../../contexts/userTokens';
import { Form } from 'antd';
import { Input } from '../../../../components/Input';
import NumericInput from '../../../../components/NumericInput';
import Button from '../../../../components/Button';
import { validators } from '../../../../utils/validators';
import { useTokenListContext } from '../../../../contexts/TokenList';
import BN from 'bn.js';
import { FraktionPrice } from './FraktionPrice';
import { Token } from '../../../../utils';

interface DetailsProps {
  nfts: UserNFT[];
  onSubmit?: (values: FormValues) => void;
}

interface FormValues {
  supply: string;
  ticker: string;
  buyoutPrice: {
    amount: string;
    token: Token | any;
  };
  pricePerFraktion: BN;
}

const calculatePricePerFraktion = (buyoutPrice: string, supply: string): BN => {
  const pricePerFraktion =
    buyoutPrice && supply && Number(buyoutPrice) / Number(supply);
  return pricePerFraktion ? new BN(pricePerFraktion * 10e5) : null;
};

export const DetailsForm = ({ nfts }: DetailsProps): JSX.Element => {
  const [val, setVal] = useState(1);
  const { tokenList } = useTokenListContext();
  const [form] = Form.useForm<FormValues>();

  const pricePerFraktionError = validators.validateFractionPrice(
    form.getFieldValue('buyoutPrice'),
    form.getFieldValue('supply'),
  );

  return (
    <Form
      form={form}
      autoComplete="off"
      layout="vertical"
      initialValues={{
        ticker: '',
        supply: '',
        buyoutPrice: { amount: '' },
        pricePerFraktion: new BN(''),
      }}
      onFieldsChange={() => {
        setVal((val) => val + 1);
      }}
      onValuesChange={(changedValues, allValues) => {
        if (changedValues.supply || changedValues.buyoutPrice) {
          form.setFieldsValue({
            pricePerFraktion: calculatePricePerFraktion(
              allValues.buyoutPrice.amount,
              allValues.supply,
            ),
          });
        }
      }}
    >
      <div className={styles.details}>
        <p className={styles.detailsTitle}>Vault details</p>
        <div className={styles.fieldWrapper}>
          {nfts.length > 1 ? (
            <>
              <Form.Item
                rules={[{ validator: validators.backetName(tokenList) }]}
                label="Basket name"
                name="basketName"
              >
                <Input placeholder="Coolest basket" />
              </Form.Item>
            </>
          ) : (
            <>
              <p className={styles.fieldLabel}>Name</p>
              <p className={styles.tokenName}>{nfts?.[0]?.metadata.name}</p>
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
            pricePerFrktBN={form.getFieldValue('pricePerFraktion')}
            error={pricePerFraktionError}
          />
        }
        <Form.Item
          label="Buyout price"
          name="buyoutPrice"
          dependencies={['supply']}
          rules={[{ validator: validators.buyoutPrice }]}
          help=""
        >
          <BuyoutField maxLength={5} />
        </Form.Item>
        {form.getFieldsError().map((el, idx) => (
          <p className={styles.err} key={idx}>
            {el?.errors?.[0]}
          </p>
        ))}
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
          className={styles.continueBtn}
        >
          Continue
        </Button>
      </div>
    </Form>
  );
};
