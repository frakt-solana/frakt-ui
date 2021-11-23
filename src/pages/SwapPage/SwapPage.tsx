import BN from 'bn.js';
import { WSOL } from '@raydium-io/raydium-sdk';
import { useEffect, useMemo, useState } from 'react';

import { AppLayout } from '../../components/Layout/AppLayout';
import { notify, Token } from '../../utils';
import styles from './styles.module.scss';
// import SettingsIcon from '../../icons/SettingsIcon';
import Button from '../../components/Button';
import { TokenFieldWithBalance } from '../../components/TokenField';
import { useSwapContext } from '../../contexts/Swap';
import { useTokenMap } from '../../contexts/TokenList';
import { useUserTokens } from '../../contexts/userTokens';

const SOL_TOKEN = {
  mint: WSOL.mint,
  symbol: 'SOL',
  img: 'https://sdk.raydium.io/icons/So11111111111111111111111111111111111111112.png',
  data: {
    address: WSOL.mint,
    decimals: WSOL.decimals,
    symbol: WSOL.symbol,
    name: WSOL.name,
  },
};

const useTokenField = () => {
  const tokensMap = useTokenMap();
  const {
    loading: poolConfigLoading,
    poolConfigs,
    fetchPoolInfo,
    swap,
  } = useSwapContext();

  const tokenList: Token[] = useMemo(() => {
    return poolConfigLoading
      ? []
      : poolConfigs.reduce(
          (acc, { baseMint }) => {
            const token = tokensMap.get(baseMint);
            return token
              ? [
                  ...acc,
                  {
                    mint: token.address,
                    symbol: token.symbol,
                    img: token.logoURI,
                    data: token,
                  },
                ]
              : acc;
          },
          [SOL_TOKEN],
        );
  }, [poolConfigLoading, poolConfigs, tokensMap]);

  return {
    poolConfigs,
    tokenList,
    loading: poolConfigLoading,
    fetchPoolInfo,
    swap,
  };
};

const SwapPage = (): JSX.Element => {
  const { rawUserTokensByMint } = useUserTokens();

  const { poolConfigs, tokenList, fetchPoolInfo, swap } = useTokenField();

  const [payValue, setPayValue] = useState<string>('');
  const [payToken, setPayToken] = useState<Token | null>(SOL_TOKEN);

  const [receiveValue, setReceiveValue] = useState<string>('');
  const [receiveToken, setReceiveToken] = useState<Token | null>(null);

  const [, setPoolInfo] = useState(null);

  useEffect(() => {
    const getPoolInfo = async () => {
      try {
        const tokenMint =
          payToken.mint === WSOL.mint ? receiveToken.mint : payToken.mint;

        const poolConfig = poolConfigs.find(
          ({ baseMint }) => baseMint === tokenMint,
        );

        const info = await fetchPoolInfo(poolConfig);

        setPoolInfo(info);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);

        notify({
          type: 'error',
          message: 'Error fetching pool info',
        });
      }
    };

    if (payToken && receiveToken) {
      getPoolInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payToken, receiveToken]);

  const swapTokens = async () => {
    const isBuy = payToken.mint === WSOL.mint;

    //? Need to get suitable pool
    const splToken = isBuy ? receiveToken : payToken;

    const poolConfig = poolConfigs.find(
      ({ baseMint }) => baseMint === splToken.mint,
    );

    const payTokenData = payToken.data;

    const tokenAmount = new BN(
      Number(payValue) * Math.pow(10, payTokenData.decimals),
    );

    await swap(rawUserTokensByMint, tokenAmount, poolConfig, isBuy);
  };

  const onPayTokenChange = (nextToken: Token) => {
    if (nextToken.mint === WSOL.mint && receiveToken?.mint === WSOL.mint) {
      setReceiveToken(null);
      setReceiveValue('');
    }
    if (nextToken.mint !== WSOL.mint && receiveToken?.mint !== WSOL.mint) {
      setReceiveToken(SOL_TOKEN);
    }
    setPayValue('');
    setPayToken(nextToken);
  };

  const onReceiveTokenChange = (nextToken: Token) => {
    if (nextToken.mint === WSOL.mint && payToken?.mint === WSOL.mint) {
      setPayToken(null);
      setPayValue('');
    }
    if (nextToken.mint !== WSOL.mint && payToken?.mint !== WSOL.mint) {
      setPayToken(SOL_TOKEN);
    }
    setReceiveValue('');
    setReceiveToken(nextToken);
  };

  return (
    <AppLayout contentClassName={styles.exchange}>
      <div className={styles.container}>
        <h1 className={styles.title}>Swap</h1>
        <div className={styles.description}>
          Swap other crypto assets with your crypto assets{' '}
        </div>
        {/* <div className={styles.settings}>
          <SettingsIcon width={24} />
        </div> */}
        <TokenFieldWithBalance
          className={styles.input}
          value={payValue}
          onValueChange={(nextValue) => setPayValue(nextValue)}
          tokensList={tokenList}
          currentToken={payToken}
          onTokenChange={onPayTokenChange}
          modalTitle="Pay"
          label="Pay"
          showMaxButton
        />
        <TokenFieldWithBalance
          className={styles.input}
          value={receiveValue}
          onValueChange={(nextValue) => setReceiveValue(nextValue)}
          currentToken={receiveToken}
          tokensList={tokenList}
          onTokenChange={onReceiveTokenChange}
          modalTitle="Receive"
          label="Receive"
        />
        <div className={styles.fee}>
          <span>Estimated fees</span>
          <div />
          <span>---</span>
        </div>
        <div className={styles.fee}>
          <span>Min Received</span>
          <div />
          <span>---</span>
        </div>
      </div>
      <Button className={styles.btn} type="alternative" onClick={swapTokens}>
        Swap
      </Button>
    </AppLayout>
  );
};

export default SwapPage;
