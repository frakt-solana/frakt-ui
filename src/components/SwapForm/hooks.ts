import { LiquidityPoolKeysV4, WSOL } from '@raydium-io/raydium-sdk';
import { useMemo, useState } from 'react';

import { PoolInfo, useSwapContext } from '../../contexts/Swap';
import { useTokenMap } from '../../contexts/TokenList';
import { notify, Token } from '../../utils';

export const useSwappableTokenList = (): Token[] => {
  const tokensMap = useTokenMap();
  const { loading: poolConfigLoading, poolConfigs } = useSwapContext();

  const tokenList: Token[] = useMemo(() => {
    return poolConfigLoading
      ? []
      : poolConfigs.reduce((acc, { baseMint }) => {
          const token = tokensMap.get(baseMint.toBase58());
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
        }, []);
  }, [poolConfigLoading, poolConfigs, tokensMap]);

  return tokenList;
};

export const useLazyPoolInfo = (): {
  poolInfo: PoolInfo | null;
  fetchPoolInfo: (
    payToken: Token,
    receiveToken: Token,
    poolConfigs: LiquidityPoolKeysV4[],
  ) => Promise<void>;
  loading: boolean;
} => {
  const { fetchPoolInfo } = useSwapContext();
  const [poolInfo, setPoolInfo] = useState<PoolInfo>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = async (
    payToken: Token,
    receiveToken: Token,
    poolConfigs: LiquidityPoolKeysV4[],
  ): Promise<void> => {
    try {
      setLoading(true);

      const tokenMint =
        payToken.mint === WSOL.mint ? receiveToken.mint : payToken.mint;

      const poolConfig = poolConfigs.find(
        ({ baseMint }) => baseMint.toBase58() === tokenMint,
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
    } finally {
      setLoading(false);
    }
  };

  return {
    poolInfo,
    fetchPoolInfo: fetch,
    loading,
  };
};
