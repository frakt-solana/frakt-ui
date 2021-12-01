import { WSOL } from '@raydium-io/raydium-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useSwapContext } from '../../contexts/Swap';
import SettingsIcon from '../../icons/SettingsIcon';
import { useUserTokens } from '../../contexts/userTokens';
import { SOL_TOKEN } from './constants';
import { getOutputAmount } from './helpers';
import { useLazyPoolInfo, useSwappableTokenList } from './hooks';
import { Token } from '../../utils';
import Button from '../Button';
import { TokenFieldWithBalance } from '../TokenField';
import styles from './styles.module.scss';
import { ChangeSidesButton } from './ChangeSidesButton';
import { SettingsModal } from './SettingsModal';
import { useFraktion } from '../../contexts/fraktion';
import { Modal } from 'antd';
import { ConfirmModal } from '../Modal/Modal';
import Tooltip from '../Tooltip';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface SwapFormInterface {
  defaultTokenMint?: string;
}

const SwapForm = ({ defaultTokenMint }: SwapFormInterface): JSX.Element => {
  const swappableTokenList = useSwappableTokenList();
  const { vaults } = useFraktion();

  const defaultReceiveToken = swappableTokenList.find(
    ({ mint }) => mint === defaultTokenMint,
  );

  const { connected } = useWallet();
  const { rawUserTokensByMint } = useUserTokens();
  const { poolConfigs, swap } = useSwapContext();

  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();

  const [payValue, setPayValue] = useState<string>('');
  const [payToken, setPayToken] = useState<Token | null>(SOL_TOKEN);

  const [receiveValue, setReceiveValue] = useState<string>('');
  const [receiveToken, setReceiveToken] = useState<Token | null>(
    defaultReceiveToken || null,
  );

  const [slippage, setSlippage] = useState<string>('1');
  const [slippageModalVisible, setSlippageModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    if (poolConfigs && payToken && receiveToken && payToken !== receiveToken) {
      fetchPoolInfo(payToken, receiveToken, poolConfigs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken, poolConfigs]);

  const intervalRef = useRef<any>();
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (poolConfigs && payToken && receiveToken && payToken !== receiveToken) {
      intervalRef.current = setInterval(() => {
        fetchPoolInfo(payToken, receiveToken, poolConfigs);
      }, 5000);
    }

    return () => clearInterval(intervalRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken, poolConfigs]);

  useEffect(() => {
    if (poolInfo && payToken !== receiveToken) {
      setReceiveValue(
        getOutputAmount(payValue, poolInfo, payToken.mint === WSOL.mint),
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
          const isBuy = payToken.mint === WSOL.mint;

          //? Need to get suitable pool
          const splToken = isBuy ? receiveToken : payToken;

          const poolConfig = poolConfigs.find(
            ({ baseMint }) => baseMint.toBase58() === splToken.mint,
          );

          const payTokenData = payToken.data;
          const receiveTokenData = receiveToken.data;

          const tokenAmountBN = new BN(
            Number(payValue) * 10 ** payTokenData.decimals,
          );

          const tokenMinAmountBN = new BN(
            Number(receiveValue) *
              10 ** receiveTokenData.decimals *
              (1 - Number(slippage) / 100),
          );

          await swap(
            rawUserTokensByMint,
            tokenAmountBN,
            tokenMinAmountBN,
            poolConfig,
            isBuy,
          );

          fetchPoolInfo(payToken, receiveToken, poolConfigs);
        },
      });
    }
    const isBuy = payToken.mint === WSOL.mint;

    //? Need to get suitable pool
    const splToken = isBuy ? receiveToken : payToken;

    const poolConfig = poolConfigs.find(
      ({ baseMint }) => baseMint.toBase58() === splToken.mint,
    );

    const payTokenData = payToken.data;
    const receiveTokenData = receiveToken.data;

    const tokenAmountBN = new BN(
      Number(payValue) * 10 ** payTokenData.decimals,
    );

    const tokenMinAmountBN = new BN(
      Number(receiveValue) *
        10 ** receiveTokenData.decimals *
        (1 - Number(slippage) / 100),
    );

    await swap(
      rawUserTokensByMint,
      tokenAmountBN,
      tokenMinAmountBN,
      poolConfig,
      isBuy,
    );

    fetchPoolInfo(payToken, receiveToken, poolConfigs);
  };

  const vaultInfo = useMemo(() => {
    if (receiveToken && payToken) {
      const token = payToken.mint === WSOL.mint ? receiveToken : payToken;

      return vaults.find(({ fractionMint }) => fractionMint === token.mint);
    } else {
      return null;
    }
  }, [vaults, receiveToken, payToken]);

  const valuationDifference: string = useMemo(() => {
    if (!vaultInfo) {
      return '';
    }

    const isBuy = payToken.mint === WSOL.mint;

    if (isBuy) {
      // ? amount of token per inputed SOL amount (by market price)
      const amountMarket = Number(receiveValue);

      // ? amount of token per inputed SOL amount (by locked price per fraction price)
      const amountLocked =
        (vaultInfo.lockedPricePerFraction.toNumber() * Number(payValue)) /
        10 ** 2;

      const difference = (amountMarket / amountLocked) * 100 - 100;

      return difference ? difference.toFixed(2) : '';
    } else {
      const amountMarketSOL = Number(receiveValue);

      const amountLockedSOL =
        (vaultInfo.lockedPricePerFraction.toNumber() * Number(receiveValue)) /
        10 ** 2;

      const difference = (amountMarketSOL / amountLockedSOL) * 100 - 100;

      return difference ? difference.toFixed(2) : '';
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultInfo, payValue, receiveValue]);

  const onPayTokenChange = (nextToken: Token) => {
    // if (nextToken.mint === WSOL.mint && receiveToken?.mint === WSOL.mint) {
    //   setReceiveToken(null);
    //   setReceiveValue('');
    // }
    if (nextToken.mint !== WSOL.mint && receiveToken?.mint !== WSOL.mint) {
      setReceiveToken(SOL_TOKEN);
    }
    setPayValue('');
    setPayToken(nextToken);
  };

  const onReceiveTokenChange = (nextToken: Token) => {
    // if (nextToken.mint === WSOL.mint && payToken?.mint === WSOL.mint) {
    //   setPayToken(null);
    //   setPayValue('');
    // }
    if (nextToken.mint !== WSOL.mint && payToken?.mint !== WSOL.mint) {
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

  const isSwapBtnEnabled = poolInfo && connected && Number(payValue) > 0;

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
          payToken?.mint === WSOL.mint ? [SOL_TOKEN] : swappableTokenList
        }
        currentToken={payToken}
        onTokenChange={payToken?.mint === WSOL.mint ? null : onPayTokenChange}
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
          receiveToken?.mint === WSOL.mint ? [SOL_TOKEN] : swappableTokenList
        }
        onTokenChange={
          receiveToken?.mint === WSOL.mint ? null : onReceiveTokenChange
        }
        modalTitle="Receive"
        label="Receive"
        disabled
      />
      <div className={styles.info}>
        <span className={styles.info__title}>
          <span>{`Slippage Tolerance     `}</span>
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
          <span>{`Minimum Received     `}</span>
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
            receiveToken?.data?.decimals || 0,
          )} ${receiveToken?.symbol || ''}`}
        </span>
      </div>
      {valuationDifference && (
        <div className={styles.info}>
          <span className={styles.info__title}>
            <span>{`Valuation difference     `}</span>
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
