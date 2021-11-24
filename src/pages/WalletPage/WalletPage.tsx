import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { getAllUserTokens } from 'solana-nft-metadata';
import { useConnection } from '@solana/wallet-adapter-react';
import classNames from 'classnames/bind';

import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { URLS } from '../../constants';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import { shortenAddress } from '../../utils/solanaUtils';
import styles from './styles.module.scss';
import { useTokenListContext } from '../../contexts/TokenList';
import BN from 'bn.js';
import { decimalBNToString } from '../../utils';
import VaultCard from '../../components/VaultCard';
import { VaultData } from '../../contexts/fraktion';
import { Loader } from '../../components/Loader';
import Button from '../../components/Button';

interface TokenInfoWithAmount extends TokenInfo {
  amountBN: BN;
}

const WalletPage = (): JSX.Element => {
  const history = useHistory();
  const [tab, setTab] = useState<'tokens' | 'vaults'>('tokens');
  const { walletPubkey } = useParams<{ walletPubkey: string }>();
  const { connection } = useConnection();
  const { vaults, loading: vaultsLoading } = useFraktion();

  const [userTokens, setUserTokens] = useState<TokenInfoWithAmount[]>([]);

  const { fraktionTokensMap, loading: tokensLoading } = useTokenListContext();

  const fetchUserTokens = async () => {
    try {
      //? Check if wallet valid
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

  const userVaults = useMemo(() => {
    return vaults
      .filter((vault) => vault.authority === walletPubkey)
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
            <h3 className={styles.description}>{`${shortenAddress(
              walletPubkey,
            )}`}</h3>
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
              <div className={styles.vaults}>
                {!userVaults.length && (
                  <p className={styles.emptyMessage}>No vaults found</p>
                )}
                {userVaults.map((vault) => (
                  <NavLink
                    key={vault.publicKey}
                    to={`${URLS.VAULT}/${vault.publicKey}`}
                  >
                    <VaultCard
                      fractionMint={vault.fractionMint}
                      name={vault.name}
                      owner={vault.authority}
                      vaultState={vault.state}
                      imageSrc={vault.imageSrc}
                      supply={vault.supply}
                      isNftVerified={vault.isNftVerified}
                      pricePerFraction={vault.lockedPricePerFraction}
                      priceTokenMint={vault.priceTokenMint}
                      buyoutPrice={vault.buyoutPrice}
                    />
                  </NavLink>
                ))}
              </div>
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
