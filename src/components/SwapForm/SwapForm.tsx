import BN from 'bn.js';
import { useEffect, useMemo, useRef, useState } from 'react';

import SettingsIcon from '../../icons/SettingsIcon';
import { getOutputAmount } from './helpers';
import { useLazyPoolInfo } from './hooks';
import Button from '../Button';
import { TokenFieldWithBalance } from '../TokenField';
import styles from './styles.module.scss';
import { ChangeSidesButton } from './ChangeSidesButton';
import { SettingsModal } from './SettingsModal';
import { useFraktion } from '../../contexts/fraktion';
import { ConfirmModal } from '../Modal/Modal';
import Tooltip from '../Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useLiquidityPools } from '../../contexts/liquidityPools';
import { TokenInfo } from '@solana/spl-token-registry';
import { SOL_TOKEN } from '../../utils';
import { useDeposit } from '../DepositModal/hooks';

interface SwapFormInterface {
  defaultTokenMint: string;
}

const SwapForm = ({ defaultTokenMint }: SwapFormInterface): JSX.Element => {
  const { vaults } = useFraktion();
  const { poolDataByMint, raydiumSwap } = useLiquidityPools();
  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();

  const [payValue, setPayValue] = useState<string>('');
  const [payToken, setPayToken] = useState<TokenInfo | null>(SOL_TOKEN);

  const [receiveValue, setReceiveValue] = useState<string>('');
  const [receiveToken, setReceiveToken] = useState<TokenInfo | null>(
    poolDataByMint.get(defaultTokenMint)?.tokenInfo || null,
  );

  const { isSwapBtnEnabled } = useDeposit(receiveToken);

  const [slippage, setSlippage] = useState<string>('1');
  const [slippageModalVisible, setSlippageModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    if (payToken && receiveToken && payToken.address !== receiveToken.address) {
      fetchPoolInfo(payToken.address, receiveToken.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  const intervalRef = useRef<any>();
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (payToken && receiveToken && payToken.address !== receiveToken.address) {
      intervalRef.current = setInterval(() => {
        fetchPoolInfo(payToken.address, receiveToken.address);
      }, 5000);
    }

    return () => clearInterval(intervalRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  useEffect(() => {
    if (poolInfo && payToken !== receiveToken) {
      setReceiveValue(
        getOutputAmount(
          payValue,
          poolInfo,
          payToken.address === SOL_TOKEN.address,
        ),
      );
    }
  }, [payValue, payToken, receiveValue, receiveToken, poolInfo]);

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
        okButtonProps: { style: { borderRadius: 0 } },
        cancelButtonProps: { style: { borderRadius: 0 } },
        onOk: async () => {
          const isBuy = payToken.address === SOL_TOKEN.address;

          //? Need to get suitable pool
          const splToken = isBuy ? receiveToken : payToken;

          const poolConfig = poolDataByMint.get(splToken.address).poolConfig;

          const tokenAmountBN = new BN(
            Number(payValue) * 10 ** payToken.decimals,
          );

          const tokenMinAmountBN = new BN(
            Number(receiveValue) *
              10 ** receiveToken.decimals *
              (1 - Number(slippage) / 100),
          );

          await raydiumSwap(tokenAmountBN, tokenMinAmountBN, poolConfig, isBuy);

          fetchPoolInfo(payToken.address, receiveToken.address);
        },
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

  const vaultInfo = useMemo(() => {
    if (receiveToken && payToken) {
      const token =
        payToken.address === SOL_TOKEN.address ? receiveToken : payToken;

      return vaults.find(({ fractionMint }) => fractionMint === token.address);
    } else {
      return null;
    }
  }, [vaults, receiveToken, payToken]);

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

  const onPayTokenChange = (nextToken: TokenInfo) => {
    if (
      nextToken.address !== SOL_TOKEN.address &&
      receiveToken?.address !== SOL_TOKEN.address
    ) {
      setReceiveToken(SOL_TOKEN);
    }
    setPayValue('');
    setPayToken(nextToken);
  };

  const onReceiveTokenChange = (nextToken: TokenInfo) => {
    if (
      nextToken.address !== SOL_TOKEN.address &&
      payToken?.address !== SOL_TOKEN.address
    ) {
      setPayToken(SOL_TOKEN);
    }
    setReceiveValue('');
    setReceiveToken(nextToken);
  };

  const changeSides = () => {
    const payValueBuf = payValue;
    const payTokenBuf = payToken;

    setPayValue(receiveValue);
    setPayToken(receiveToken);

    setReceiveValue(payValueBuf);
    setReceiveToken(payTokenBuf);
  };

  return (
    <div>
      <div className={styles.settings}>
        <SettingsIcon
          width={24}
          styles={{ cursor: 'pointer' }}
          onClick={() => setSlippageModalVisible(true)}
        />
      </div>
      <TokenFieldWithBalance
        className={styles.input}
        value={payValue}
        onValueChange={(nextValue) => setPayValue(nextValue)}
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
      <ChangeSidesButton onClick={changeSides} />
      <TokenFieldWithBalance
        className={styles.input}
        value={receiveValue}
        onValueChange={(nextValue) => nextValue}
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
