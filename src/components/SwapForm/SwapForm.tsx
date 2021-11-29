import { WSOL } from '@raydium-io/raydium-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import BN from 'bn.js';
import { useEffect, useState } from 'react';

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

const SwapForm = (): JSX.Element => {
  const { connected } = useWallet();
  const { rawUserTokensByMint } = useUserTokens();
  const swappableTokenList = useSwappableTokenList();
  const { poolConfigs, swap } = useSwapContext();

  const { poolInfo, fetchPoolInfo } = useLazyPoolInfo();

  const [payValue, setPayValue] = useState<string>('');
  const [payToken, setPayToken] = useState<Token | null>(SOL_TOKEN);

  const [receiveValue, setReceiveValue] = useState<string>('');
  const [receiveToken, setReceiveToken] = useState<Token | null>(null);

  const [slippage, setSlippage] = useState<string>('0.5');
  const [slippageModalVisible, setSlippageModalVisible] =
    useState<boolean>(false);

  useEffect(() => {
    if (poolConfigs && payToken && receiveToken && payToken !== receiveToken) {
      fetchPoolInfo(payToken, receiveToken, poolConfigs);
    }
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
    const isBuy = payToken.mint === WSOL.mint;

    //? Need to get suitable pool
    const splToken = isBuy ? receiveToken : payToken;

    const poolConfig = poolConfigs.find(
      ({ baseMint }) => baseMint.toBase58() === splToken.mint,
    );

    const payTokenData = payToken.data;

    const tokenAmountBN = new BN(
      Number(payValue) * 10 ** payTokenData.decimals,
    );

    const tokenMinAmountBN = new BN(
      Number(payValue) *
        10 ** payTokenData.decimals *
        (1 - Number(slippage) / 100),
    );

    await swap(
      rawUserTokensByMint,
      tokenAmountBN,
      tokenMinAmountBN,
      poolConfig,
      isBuy,
    );
  };

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
        <span className={styles.info__title}>Slippage Tolerance</span>
        <span className={styles.info__value}>{`${slippage}%`}</span>
      </div>
      <div className={styles.info}>
        <span className={styles.info__title}>Minimum Received</span>
        <span className={styles.info__value}>
          {`${(Number(receiveValue) * (1 - Number(slippage) / 100)).toFixed(
            receiveToken?.data?.decimals || 0,
          )} ${receiveToken?.symbol || ''}`}
        </span>
      </div>
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