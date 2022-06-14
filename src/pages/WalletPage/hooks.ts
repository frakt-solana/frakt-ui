import { TokenInfo } from '@solana/spl-token-registry';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { utils, web3 } from '@frakt-protocol/frakt-sdk';

import { selectTokenListState } from '../../state/tokenList/selectors';
import {
  NameServiceResponse,
  useNameServiceInfo,
} from '../../utils/nameService';
import { TokenInfoWithAmount } from './components/TokensTab/TokensTab';
import { useConnection } from '../../hooks';

type UseWalletTokens = (props: { walletPubkey: string }) => {
  userTokens: TokenInfoWithAmount[];
  loading: boolean;
};

export const useWalletTokens: UseWalletTokens = ({ walletPubkey }) => {
  const { fraktionTokensMap, loading: tokensLoading } =
    useSelector(selectTokenListState);

  const [userTokens, setUserTokens] = useState<TokenInfoWithAmount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const connection = useConnection();

  const fetchUserTokens = async () => {
    try {
      setLoading(true);

      const userTokens = await utils.getAllUserTokens({
        connection,
        walletPublicKey: new web3.PublicKey(walletPubkey),
      });

      setUserTokens(
        userTokens
          .reduce((acc, tokenView) => {
            const tokenInfo: TokenInfo = fraktionTokensMap.get(
              String(tokenView.mint),
            );
            return tokenInfo
              ? [...acc, { ...tokenInfo, amountBN: tokenView.amountBN }]
              : acc;
          }, [])
          .sort(
            (tokenA: TokenInfoWithAmount, tokenB: TokenInfoWithAmount) =>
              tokenA.amountBN.toNumber() - tokenB.amountBN.toNumber(),
          ),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tokensLoading && fraktionTokensMap?.size) {
      fetchUserTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensLoading, fraktionTokensMap?.size, walletPubkey]);

  return {
    userTokens,
    loading: loading || tokensLoading,
  };
};

type UseNameService = (props: { walletPubkey: string }) => {
  nameServiceInfo: NameServiceResponse;
};

export const useNameService: UseNameService = ({ walletPubkey }) => {
  const connection = useConnection();

  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();

  useEffect(() => {
    walletPubkey && getNameServiceInfo(walletPubkey, connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletPubkey]);

  return {
    nameServiceInfo,
  };
};
