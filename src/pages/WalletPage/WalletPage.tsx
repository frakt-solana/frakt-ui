import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { getAllUserTokens, TokenView } from 'solana-nft-metadata';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { URLS } from '../../constants';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import { useSolanaTokenRegistry } from '../../contexts/solanaTokenRegistry/solanaTokenRegistry.context';
import { useConnection } from '../../external/contexts/connection';
import { shortenAddress } from '../../external/utils/utils';
import styles from './styles.module.scss';

interface TokenViewWithTokenInfo {
  mint: string;
  tokenView: TokenView;
  tokenInfo: any;
  // should be TokenInfo but don't allow to use extensions
}

const WalletPage = (): JSX.Element => {
  const { walletPubkey } = useParams<{ walletPubkey: string }>();

  const [userTokens, setUserTokens] = useState<TokenViewWithTokenInfo[]>([]);
  const [tab, setTab] = useState<'tokens' | 'vaults'>('tokens');
  const { vaults } = useFraktion();
  const { fraktionTokens, loading: loadingTokens } = useSolanaTokenRegistry();
  const connection = useConnection();

  const fetchUserTokens = async () => {
    const userTokens = await getAllUserTokens(new PublicKey(walletPubkey), {
      connection,
    });

    setUserTokens(
      userTokens
        .reduce((acc, tokenView) => {
          const tokenInfo = fraktionTokens.find(
            (tokenInfo: TokenInfo) => tokenInfo.address === tokenView.mint,
          );
          return tokenInfo
            ? [...acc, { tokenView, tokenInfo, mint: tokenView.mint }]
            : acc;
        }, [])
        .sort(
          (a: TokenViewWithTokenInfo, b: TokenViewWithTokenInfo) =>
            a.tokenView.amountBN.toNumber() - b.tokenView.amountBN.toNumber(),
        ),
    );
  };

  useEffect(() => {
    if (!loadingTokens && fraktionTokens.length && tab === 'tokens') {
      fetchUserTokens();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingTokens, tab]);

  const onSwitchTab = (e) => {
    setTab(e.target.name);
  };

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h2 className={styles.pageTitle}>{`${shortenAddress(
          walletPubkey,
        )}`}</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              tab === 'tokens' ? styles.activeTab : ''
            }`}
            name="tokens"
            onClick={onSwitchTab}
          >
            Tokens
          </button>
          <button
            className={`${styles.tab} ${
              tab === 'vaults' ? styles.activeTab : ''
            }`}
            name="vaults"
            onClick={onSwitchTab}
          >
            Vaults
          </button>
        </div>

        {tab === 'tokens' && (
          <div className={styles.tokensContainer}>
            {userTokens.map((token) => (
              <div className={styles.token} key={token.mint as string}>
                <div className={styles.tokenData}>
                  <div className={styles.tokenLogoContainer}>
                    <img
                      className={styles.tokenLogo}
                      src={token.tokenInfo.logoURI}
                    />
                  </div>
                  <div>
                    <div>{token.tokenInfo.name}</div>
                    <div className={styles.tokenBalance}>
                      {/* TODO: better balance calc */}
                      {`${(token.tokenView.amount as number) / 1000} ${
                        token.tokenInfo.symbol
                      }`}
                    </div>
                  </div>
                </div>

                <NavLink
                  to={`${URLS.VAULT}/${token.tokenInfo.extensions.vaultPubkey}`}
                >
                  Vault
                </NavLink>
              </div>
            ))}
          </div>
        )}

        {tab === 'vaults' && (
          <div className={styles.tokensContainer}>
            {vaults
              .filter((vault) => vault.authority === walletPubkey)
              .map((vault) => (
                <div className={styles.token} key={vault.publicKey as string}>
                  <div className={styles.tokenData}>
                    <div className={styles.tokenLogoContainer}>
                      <img className={styles.tokenLogo} src={vault.imageSrc} />
                    </div>
                    <div>
                      <div>{vault.name}</div>
                      {/* <div className={styles.tokenBalance}>
                    {`${token.tokenView.amount} ${token.tokenInfo.symbol}`}
                  </div> */}
                    </div>
                  </div>

                  <NavLink to={`${URLS.VAULT}/${vault.publicKey}`}>
                    Vault
                  </NavLink>
                </div>
              ))}
          </div>
        )}
      </Container>
    </AppLayout>
  );
};

export default WalletPage;
