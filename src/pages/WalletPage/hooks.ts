import { TokenInfo } from '@solana/spl-token-registry';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { getAllUserTokens } from 'solana-nft-metadata';

import {
  useFraktion,
  useFraktionInitialFetch,
  VaultData,
  VaultState,
} from '../../contexts/fraktion';
import { useTokenListContext } from '../../contexts/TokenList';
import {
  NameServiceResponse,
  useNameServiceInfo,
} from '../../utils/nameService';
import { TokenInfoWithAmount } from './components/TokensTab/TokensTab';

type UseWalletVaults = (props: { walletPubkey: string }) => {
  walletVaults: VaultData[];
  walletUnfinishedVaults: VaultData[];
  loading: boolean;
};

export const useWalletVaults: UseWalletVaults = ({ walletPubkey }) => {
  const { vaults, loading: vaultsLoading } = useFraktion();
  useFraktionInitialFetch();

  const walletVaults = useMemo(() => {
    if (vaults?.length && walletPubkey) {
      return vaults
        .filter(
          (vault) =>
            vault.authority === walletPubkey &&
            vault.state !== VaultState.Inactive &&
            vault.state !== VaultState.Archived,
        )
        .sort(
          (vaultA: VaultData, vaultB: VaultData) => vaultB.state - vaultA.state,
        );
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults?.length, walletPubkey]);

  const walletUnfinishedVaults = useMemo(() => {
    if (vaults?.length && walletPubkey) {
      return vaults
        .filter(
          (vault) =>
            vault.authority === walletPubkey &&
            vault.state === VaultState.Inactive,
        )
        .sort(
          (vaultA: VaultData, vaultB: VaultData) =>
            vaultB?.createdAt - vaultA?.createdAt,
        );
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults?.length, walletPubkey]);

  return {
    walletVaults,
    walletUnfinishedVaults,
    loading: vaultsLoading,
  };
};

type UseWalletTokens = (props: { walletPubkey: string }) => {
  userTokens: TokenInfoWithAmount[];
  loading: boolean;
};

export const useWalletTokens: UseWalletTokens = ({ walletPubkey }) => {
  const { fraktionTokensMap, loading: tokensLoading } = useTokenListContext();

  const [userTokens, setUserTokens] = useState<TokenInfoWithAmount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { connection } = useConnection();

  const fetchUserTokens = async () => {
    try {
      setLoading(true);

      const userTokens = await getAllUserTokens(new PublicKey(walletPubkey), {
        connection,
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
  const { connection } = useConnection();

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
