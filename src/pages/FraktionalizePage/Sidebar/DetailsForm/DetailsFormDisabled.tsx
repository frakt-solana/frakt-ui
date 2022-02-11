import React, { useEffect } from 'react';
import { Form } from 'antd';

import styles from './styles.module.scss';
import { Input } from '../../../../components/Input';
import NumericInput from '../../../../components/NumericInput';
import Button from '../../../../components/Button';
import { useTokenListContext } from '../../../../contexts/TokenList';
import { FraktionPrice } from './FraktionPrice';
import TokenField, {
  TOKEN_FIELD_CURRENCY,
} from '../../../../components/TokenField';
import { VaultData } from '../../../../contexts/fraktion';

interface DetailsFormDisabledProps {
  vaultData: VaultData;
  onSubmit: () => void;
  continueBtnDisabled: boolean;
}

interface FormValues {
  ticker: string;
  supply: string;
  vaultName: string;
}

export const DetailsFormDisabled: React.FC<DetailsFormDisabledProps> = ({
  onSubmit,
  vaultData,
  continueBtnDisabled,
}) => {
  const [form] = Form.useForm<FormValues>();

  const { tokensList, loading: tokensListLoading } = useTokenListContext();

  const startBid: string = (
    vaultData.lockedPricePerShare.mul(vaultData.fractionsSupply).toNumber() /
    1e9
  ).toFixed();

  useEffect(() => {
    if (tokensList.length && !tokensListLoading) {
      const fraktionToken = tokensList.find(
        ({ address }) => address === vaultData.fractionMint,
      );

      const vaultName = fraktionToken?.name || `Vault #${vaultData.createdAt}`;
      const ticker = fraktionToken?.symbol || 'XXX';

      form.setFields([
        { name: 'vaultName', value: vaultName },
        { name: 'ticker', value: ticker },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensList, tokensListLoading]);

  return (
    <>
      <div className={styles.details}>
        <Form form={form} autoComplete="off" layout="vertical">
          <p className={styles.detailsTitle}>Vault details</p>
          <div className={styles.fieldWrapper}>
            <Form.Item label="Vault name" name="vaultName" help="">
              <Input disabled />
            </Form.Item>
          </div>
          <div className={styles.fieldWrapperDouble}>
            <Form.Item validateFirst label="Supply" name="supply" help="">
              <NumericInput
                placeholder="1000"
                positiveOnly
                integerOnly
                maxLength={9}
                disabled
              />
            </Form.Item>
            <Form.Item label="Ticker" name="ticker" help="">
              <Input
                placeholder="XXX"
                disableNumbers
                disableSymbols
                maxLength={4}
                disabled
              />
            </Form.Item>
          </div>
          {
            <FraktionPrice
              pricePerFrktBN={vaultData.lockedPricePerShare || null}
              error=""
            />
          }
          <Form.Item label="Start bid" help="">
            <TokenField
              disabled
              currentToken={TOKEN_FIELD_CURRENCY.SOL}
              value={startBid}
              onValueChange={() => {}}
              className={styles.tokenFieldDisabled}
            />
          </Form.Item>
        </Form>
      </div>
      <div className={styles.continueBtnContainer}>
        <Button
          onClick={onSubmit}
          type="alternative"
          disabled={continueBtnDisabled}
          className={styles.continueBtn}
        >
          Continue
        </Button>
      </div>
    </>
  );
};
