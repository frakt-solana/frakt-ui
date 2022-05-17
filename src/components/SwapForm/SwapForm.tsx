import { FC, useState } from 'react';
import { Controller } from 'react-hook-form';

import Button from '../Button';
import { TokenFieldWithBalance } from '../TokenField';
import styles from './styles.module.scss';
import { ChangeSidesButton } from './ChangeSidesButton';
import Tooltip from '../Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { InputControlsNames } from '../SwapForm/hooks/useSwapForm';
import { useSwapForm } from './hooks/useSwapForm';
import { ConfirmModal } from '../ConfirmModal';
import { LoadingModal } from '../LoadingModal';
import { SlippageDropdown } from '../../pages/NFTPools/components/ModalParts';
import { useLiquidityPools } from '../../contexts/liquidityPools';

const MAX_PERCENT_VALUATION_DIFFERENCE = 15;
const PRICE_IMPACT_WRANING_TRESHOLD = 15;

interface SwapFormInterface {
  defaultTokenMint?: string;
}

const SwapForm: FC<SwapFormInterface> = ({ defaultTokenMint }) => {
  const {
    isSwapBtnEnabled,
    receiveToken,
    onPayTokenChange,
    onReceiveTokenChange,
    payToken,
    changeSides,
    formControl,
    slippage,
    setSlippage,
    tokenMinAmount,
    tokenPriceImpact,
    valuationDifference,
    handleSwap,
    confirmModalVisible,
    openConfirmModal,
    closeConfirmModal,
    loadingModalVisible,
    closeLoadingModal,
  } = useSwapForm(defaultTokenMint);

  const [isSlippageVisible, setIsSlippageVisible] = useState<boolean>(false);

  const { poolDataByMint } = useLiquidityPools();

  const rawPoolsInfo = Array.from(poolDataByMint.values()).map(
    ({ tokenInfo }) => tokenInfo,
  );

  const swapTokens = () => {
    if (
      Math.abs(Number(tokenPriceImpact)) > PRICE_IMPACT_WRANING_TRESHOLD ||
      Math.abs(Number(valuationDifference)) > MAX_PERCENT_VALUATION_DIFFERENCE
    ) {
      openConfirmModal();
      return;
    }
    handleSwap();
  };

  return (
    <div>
      <div className={styles.settings}>
        <SlippageDropdown
          slippage={slippage.toString()}
          setSlippage={(slippage) => setSlippage(parseFloat(slippage))}
          isSlippageDropdpwnVisible={isSlippageVisible}
          setIsSlippageDropdpwnVisible={setIsSlippageVisible}
          posRight
        />
        <p>Slippage settings</p>
      </div>
      <Controller
        control={formControl}
        name={InputControlsNames.PAY_VALUE}
        render={({ field: { onChange, value } }) => (
          <TokenFieldWithBalance
            className={styles.input}
            value={value}
            onValueChange={onChange}
            tokensList={rawPoolsInfo}
            currentToken={payToken}
            onTokenChange={onPayTokenChange}
            modalTitle="Pay"
            label="Pay"
            showMaxButton
          />
        )}
      />

      <ChangeSidesButton onClick={changeSides} />
      <Controller
        control={formControl}
        name={InputControlsNames.RECEIVE_VALUE}
        render={({ field: { onChange, value } }) => (
          <TokenFieldWithBalance
            className={styles.input}
            value={value}
            onValueChange={onChange}
            currentToken={receiveToken}
            tokensList={rawPoolsInfo}
            onTokenChange={onReceiveTokenChange}
            modalTitle="Receive"
            label="Receive"
            disabled
          />
        )}
      />
      <div className={styles.info}>
        <span className={styles.info__title}>
          <span className={styles.info__titleName}>Slippage Tolerance</span>
          <span>
            <Tooltip
              placement="top"
              trigger="hover"
              overlay="The maximum difference between your estimated price and execution price."
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        </span>
        <span className={styles.info__value}>{`${slippage}%`}</span>
      </div>
      {!!tokenMinAmount && (
        <div className={styles.info}>
          <span className={styles.info__title}>
            <span className={styles.info__titleName}>Minimum Received</span>
            <span>
              <Tooltip
                placement="top"
                trigger="hover"
                overlay="The least amount of tokens you will recieve on this trade"
              >
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          </span>
          <span className={styles.info__value}>
            {tokenMinAmount} {receiveToken?.symbol || ''}
          </span>
        </div>
      )}
      {tokenPriceImpact && (
        <div className={styles.info}>
          <span className={styles.info__title}>
            <span className={styles.info__titleName}>Price Impact</span>
            <Tooltip
              placement="top"
              trigger="hover"
              overlay="The difference between the market price and estimated price due to trade size"
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
          <span className={styles.info__value}>{`${tokenPriceImpact}%`}</span>
        </div>
      )}
      {valuationDifference && (
        <div className={styles.info}>
          <span className={styles.info__title}>
            <span className={styles.info__titleName}>Valuation Difference</span>
            <Tooltip
              placement="top"
              trigger="hover"
              overlay="Swap price difference from the initial price per fraktion set for buyout"
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
          <span
            className={styles.info__value}
          >{`${valuationDifference}%`}</span>
        </div>
      )}
      <Button
        className={styles.btn}
        type="alternative"
        onClick={swapTokens}
        disabled={!isSwapBtnEnabled}
      >
        Swap
      </Button>
      <ConfirmModal
        title={`Continue with\n current price?`}
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        btnAgree="Swap anyway"
        subtitle={`Swap price is very different from the
        initial price per fraktion set for buyout or/and market price.\n
        It usually happens due to low liquidity
        in the pool, or the asset being
        overpriced/underpriced.\n
        Do you wish to perform the swap anyway?`}
        onSubmit={handleSwap}
      />
      <LoadingModal
        visible={loadingModalVisible}
        onCancel={closeLoadingModal}
      />
    </div>
  );
};

export default SwapForm;
