import { TokenInfo } from '@solana/spl-token-registry';
import { PublicKey } from '@solana/web3.js';
import { useState, useMemo, useEffect } from 'react';
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
  const [userTokens, setUserTokens] = useState<TokenViewWithTokenInfo[]>([]);
  const { walletPubkey } = useParams<{ walletPubkey: string }>();
  const { loading: loadingVaults, vaults } = useFraktion();
  const { fraktionTokens, loading: loadingTokens } = useSolanaTokenRegistry();
  const connection = useConnection();

  const fetchUserTokens = async () => {
    console.log('#fired');
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

    // setUserTokens(userTokens.filter(({ mint }) => fraktionTokens.find(({ address }) => address === mint)))
  };

  useEffect(() => {
    if (!loadingTokens && fraktionTokens.length) {
      fetchUserTokens();
    }
  }, [loadingTokens]);

  return (
    <AppLayout>
      <Container component="main">
        <h2 className={styles.pageTitle}>{`Wallet ${shortenAddress(
          walletPubkey,
        )}`}</h2>
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
                    {`${token.tokenView.amount} ${token.tokenInfo.symbol}`}
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
      </Container>
    </AppLayout>
  );
};

export default WalletPage;
