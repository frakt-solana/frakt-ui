import { TokenInfo } from '@solana/spl-token-registry';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getAllUserTokens } from 'solana-nft-metadata';
import { PATHS } from '../../constants';
import {
  useFraktion,
  useFraktionInitialFetch,
  useFraktionPolling,
  VaultData,
  VaultState,
} from '../../contexts/fraktion';
import { useTokenListContext } from '../../contexts/TokenList';
import { UserNFT, useUserTokens } from '../../contexts/userTokens';

export interface TokenInfoWithAmount extends TokenInfo {
  amountBN: BN;
}

export enum WalletTabs {
  TOKENS = 'tokens',
  VAULTS = 'vaults',
  LOANS = 'loans',
}

export const useWalletPage = (): {
  onSwitchTab: (event) => void;
  tab: WalletTabs;
  rawNfts: UserNFT[];
  tokensLoading: boolean;
  userTokens: TokenInfoWithAmount[];
  userVaults: VaultData[];
  vaultsLoading: boolean;
  nftsLoading: boolean;
} => {
  const history = useHistory();
  const [tab, setTab] = useState<WalletTabs>(WalletTabs.TOKENS);

  const { walletPubkey } = useParams<{ walletPubkey: string }>();
  const { connection } = useConnection();
  const { connected } = useWallet();
  const { vaults, loading: vaultsLoading } = useFraktion();
  useFraktionInitialFetch();
  useFraktionPolling();

  const [userTokens, setUserTokens] = useState<TokenInfoWithAmount[]>([]);

  const { fraktionTokensMap, loading: tokensLoading } = useTokenListContext();

  const {
    nfts: rawNfts,
    loading: userTokensLoading,
    nftsLoading,
    fetchUserNfts,
    rawUserTokensByMint,
  } = useUserTokens();

  useEffect(() => {
    if (
      connected &&
      !userTokensLoading &&
      !nftsLoading &&
      Object.keys(rawUserTokensByMint).length
    ) {
      fetchUserNfts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, userTokensLoading, nftsLoading]);

  const fetchUserTokens = async () => {
    try {
      //? Checking if wallet valid
      new PublicKey(walletPubkey);

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
    } catch (err) {
      history.replace(PATHS.ROOT);
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  useEffect(() => {
    !tokensLoading && fetchUserTokens();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensLoading]);

  const userVaults = useMemo(() => {
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
  }, [vaults, walletPubkey]);

  const onSwitchTab = (event: any) => {
    setTab(event.target.name);
  };

  return {
    onSwitchTab,
    tab,
    rawNfts,
    tokensLoading,
    userTokens,
    userVaults,
    vaultsLoading,
    nftsLoading,
  };
};
