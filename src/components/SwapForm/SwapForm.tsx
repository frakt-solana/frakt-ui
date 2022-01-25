import BN from 'bn.js';
import { FC, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';

import SettingsIcon from '../../icons/SettingsIcon';
import Button from '../Button';
import { TokenFieldWithBalance } from '../TokenField';
import styles from './styles.module.scss';
import { ChangeSidesButton } from './ChangeSidesButton';
import { SettingsModal } from './SettingsModal';
import { ConfirmModal } from '../Modal/Modal';
import Tooltip from '../Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useLiquidityPools } from '../../contexts/liquidityPools';
import { SOL_TOKEN } from '../../utils';
import { InputControlsNames } from '../SwapForm/hooks/useSwapForm';
import { useLazyPoolInfo } from './hooks/useLazyPoolInfo';
import { useSwapForm } from './hooks/useSwapForm';

interface SwapFormInterface {
  defaultTokenMint: string;
}

const SwapForm: FC<SwapFormInterface> = ({ defaultTokenMint }) => {
  const { poolDataByMint, raydiumSwap } = useLiquidityPools();
  const { fetchPoolInfo } = useLazyPoolInfo();

  const {
    isSwapBtnEnabled,
    receiveToken,
    payValue,
    onPayTokenChange,
    onReceiveTokenChange,
    payToken,
    receiveValue,
    changeSides,
    formControl,
    vaultInfo,
  } = useSwapForm(defaultTokenMint);

  const [slippage, setSlippage] = useState<string>('1');
  const [slippageModalVisible, setSlippageModalVisible] =
    useState<boolean>(false);

  const handleSwap = async () => {
    const isBuy = payToken.address === SOL_TOKEN.address;

    //? Need to get suitable pool
    const splToken = isBuy ? receiveToken : payToken;

    const poolConfig = poolDataByMint.get(splToken.address).poolConfig;

    const tokenAmountBN = new BN(Number(payValue) * 10 ** payToken.decimals);

    const tokenMinAmountBN = new BN(
      Number(receiveValue) *
        10 ** receiveToken.decimals *
        (1 - Number(slippage) / 100),
    );

    await raydiumSwap(tokenAmountBN, tokenMinAmountBN, poolConfig, isBuy);

    fetchPoolInfo(payToken.address, receiveToken.address);
  };

  const swapTokens = async () => {
    if (
      parseFloat(valuationDifference) > 15 ||
      parseFloat(valuationDifference) < -15
    ) {
      return ConfirmModal({
        title: 'Continue with current price?',
        content: (
          <div>
            <p>
              Swap price is very different from the initial price per fraktion
              set for buyout.
            </p>
            <br />
            <p>
              It usually happens due to low liquidity in the pool, or the asset
              being overpriced/underpriced.
            </p>
            <br />
            <p>Do you wish to perform the swap anyway?</p>
          </div>
        ),
        okText: 'Swap anyway',
        // * @sablevsky, sorry bro :)
        onOk: handleSwap,
      });
    }
    const isBuy = payToken.address === SOL_TOKEN.address;

    //? Need to get suitable pool
    const splToken = isBuy ? receiveToken : payToken;

    const poolConfig = poolDataByMint.get(splToken.address)?.poolConfig;

    const tokenAmountBN = new BN(Number(payValue) * 10 ** payToken.decimals);

    const tokenMinAmountBN = new BN(
      Number(receiveValue) *
        10 ** receiveToken.decimals *
        (1 - Number(slippage) / 100),
    );

    await raydiumSwap(tokenAmountBN, tokenMinAmountBN, poolConfig, isBuy);

    fetchPoolInfo(payToken.address, receiveToken.address);
  };

  const valuationDifference: string = useMemo(() => {
    if (!vaultInfo) {
      return '';
    }

    const isBuy = payToken.address === SOL_TOKEN.address;

    if (isBuy) {
      // ? amount of token per inputed SOL amount (by market price)
      const amountMarket = Number(receiveValue);

      // ? amount of token per inputed SOL amount (by locked price per fraction price)
      const amountLocked =
        (vaultInfo.lockedPricePerShare.toNumber() * Number(payValue)) / 10 ** 2;

      const difference = (amountMarket / amountLocked) * 100 - 100;

      return isNaN(difference) ? '' : difference.toFixed(2);
    } else {
      const amountMarketSOL = Number(receiveValue);

      const amountLockedSOL =
        (vaultInfo.lockedPricePerShare.toNumber() * Number(payValue)) / 10 ** 6;

      const difference = (amountMarketSOL / amountLockedSOL) * 100 - 100;

      return isNaN(difference) ? '' : difference.toFixed(2);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultInfo, payValue, receiveValue]);

  return (
    <div>
      <div className={styles.settings}>
        <SettingsIcon
          width={24}
          styles={{ cursor: 'pointer' }}
          onClick={() => setSlippageModalVisible(true)}
        />
      </div>
      <Controller
        control={formControl}
        name={InputControlsNames.PAY_VALUE}
        render={({ field: { onChange, value } }) => (
          <TokenFieldWithBalance
            className={styles.input}
            value={value}
            onValueChange={onChange}
            tokensList={
              payToken?.address === SOL_TOKEN.address
                ? [SOL_TOKEN]
                : Array.from(poolDataByMint.values()).map(
                    ({ tokenInfo }) => tokenInfo,
                  )
            }
            currentToken={payToken}
            onTokenChange={
              payToken?.address === SOL_TOKEN.address ? null : onPayTokenChange
            }
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
            tokensList={
              receiveToken?.address === SOL_TOKEN.address
                ? [SOL_TOKEN]
                : Array.from(poolDataByMint.values()).map(
                    ({ tokenInfo }) => tokenInfo,
                  )
            }
            onTokenChange={
              receiveToken?.address === SOL_TOKEN.address
                ? null
                : onReceiveTokenChange
            }
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
          {`${(Number(receiveValue) * (1 - Number(slippage) / 100)).toFixed(
            receiveToken?.decimals || 0,
          )} ${receiveToken?.symbol || ''}`}
        </span>
      </div>
      {valuationDifference && (
        <div className={styles.info}>
          <span className={styles.info__title}>
            <span className={styles.info__titleName}>Valuation difference</span>
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
      <SettingsModal
        visible={slippageModalVisible}
        slippage={slippage}
        setSlippage={setSlippage}
        onCancel={() => setSlippageModalVisible(false)}
      />
    </div>
  );
};

export default SwapForm;
