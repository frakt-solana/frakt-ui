import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { getAllUserTokens } from 'solana-nft-metadata';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import classNames from 'classnames/bind';
import BN from 'bn.js';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { URLS } from '../../constants';
import { useFraktion, VaultData, VaultState } from '../../contexts/fraktion';
import { shortenAddress } from '../../utils/solanaUtils';
import styles from './styles.module.scss';
import { useTokenListContext } from '../../contexts/TokenList';
import { decimalBNToString } from '../../utils';
import VaultCard from '../../components/VaultCard';
import { Loader } from '../../components/Loader';
import Button from '../../components/Button';
import { getOwnerAvatar, useNameServiceInfo } from '../../utils/nameService';
import { TwitterIcon2 } from '../../icons';
import Toggle from '../../components/Toggle/Toggle';

interface TokenInfoWithAmount extends TokenInfo {
  amountBN: BN;
}

const WalletPage = (): JSX.Element => {
  const history = useHistory();
  const [tab, setTab] = useState<'tokens' | 'vaults'>('tokens');
  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();
  const { walletPubkey } = useParams<{ walletPubkey: string }>();
  const { connection } = useConnection();
  const { vaults, loading: vaultsLoading } = useFraktion();
  const { connected, publicKey } = useWallet();

  const [userTokens, setUserTokens] = useState<TokenInfoWithAmount[]>([]);

  const [showUnfinished, setShowUnfinished] = useState<boolean>(false);

  const { fraktionTokensMap, loading: tokensLoading } = useTokenListContext();

  const onToggleUnfinishedClick = () => {
    setShowUnfinished(!showUnfinished);
  };

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
      history.replace(URLS.ROOT);
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  useEffect(() => {
    !tokensLoading && fetchUserTokens();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensLoading]);

  useEffect(() => {
    walletPubkey && getNameServiceInfo(walletPubkey, connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletPubkey]);

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

  const userUnfinishedVaults = useMemo(() => {
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
  }, [vaults, walletPubkey]);

  const onSwitchTab = (event: any) => {
    setTab(event.target.name);
  };

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <div className={styles.pageHeader}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>Wallet collection</h2>
            <h3 className={styles.description}>
              <div
                className={styles.ownerAvatar}
                style={{
                  backgroundImage: `url(${getOwnerAvatar(
                    nameServiceInfo.twitterHandle,
                  )})`,
                }}
              />
              {nameServiceInfo?.domain
                ? `${nameServiceInfo?.domain} (${shortenAddress(walletPubkey)})`
                : `${shortenAddress(walletPubkey)}`}
              {nameServiceInfo?.twitterHandle && (
                <a
                  className={styles.ownerTwitter}
                  href={`https://twitter.com/${nameServiceInfo.twitterHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon2 width={24} className={styles.twitterIcon} />
                </a>
              )}
            </h3>
          </div>
          <div className={styles.tabs}>
            <button
              className={classNames([
                styles.tab,
                { [styles.tabActive]: tab === 'tokens' },
              ])}
              name="tokens"
              onClick={onSwitchTab}
            >
              Tokens
            </button>
            <button
              className={classNames([
                styles.tab,
                { [styles.tabActive]: tab === 'vaults' },
              ])}
              name="vaults"
              onClick={onSwitchTab}
            >
              Vaults
            </button>
          </div>
        </div>

        {tab === 'tokens' && (
          <>
            {tokensLoading ? (
              <div className={styles.loader}>
                <Loader size={'large'} />
              </div>
            ) : (
              <div className={styles.tokens}>
                {!userTokens.length && (
                  <p className={styles.emptyMessage}>No tokens found</p>
                )}
                {userTokens.map((token) => (
                  <TokenCard key={token.address} token={token} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'vaults' && (
          <>
            {vaultsLoading ? (
              <div className={styles.loader}>
                <Loader size={'large'} />
              </div>
            ) : (
              <>
                <div className={styles.filters}>
                  {connected && publicKey.toString() === walletPubkey && (
                    <Toggle
                      value={showUnfinished}
                      label="Show unfinished"
                      className={styles.filter}
                      onChange={onToggleUnfinishedClick}
                    />
                  )}
                </div>
                {showUnfinished ? (
                  <div className={styles.vaults}>
                    {!userUnfinishedVaults.length && (
                      <p className={styles.emptyMessage}>
                        No unfinished vaults found
                      </p>
                    )}
                    {userUnfinishedVaults.map((vault) => (
                      <NavLink
                        key={vault.vaultPubkey}
                        to={`${URLS.VAULT}/${vault.vaultPubkey}`}
                      >
                        <VaultCard vaultData={vault} />
                      </NavLink>
                    ))}
                  </div>
                ) : (
                  <div className={styles.vaults}>
                    {!userVaults.length && (
                      <p className={styles.emptyMessage}>No vaults found</p>
                    )}
                    {userVaults.map((vault) => (
                      <NavLink
                        key={vault.vaultPubkey}
                        to={`${URLS.VAULT}/${vault.vaultPubkey}`}
                      >
                        <VaultCard vaultData={vault} />
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </AppLayout>
  );
};

const TokenCard = ({ token }: { token: TokenInfoWithAmount }): JSX.Element => {
  const vaultPubkey = (token.extensions as any)?.vaultPubkey;

  return (
    <NavLink to={`${URLS.VAULT}/${vaultPubkey}`} className={styles.token}>
      <div className={styles.token__info}>
        <img
          className={styles.token__logo}
          src={token?.logoURI}
          alt={token.name}
        />
        <div>
          <div className={styles.token__name}>{token.name}</div>
          <div className={styles.token__balance}>
            {`${decimalBNToString(
              token?.amountBN || new BN(0),
              3,
              token?.decimals || 3,
            )} ${token.symbol}`}
          </div>
        </div>
      </div>
      <Button type="alternative" className={styles.token__btn}>
        Browse vault
      </Button>
    </NavLink>
  );
};

export default WalletPage;
