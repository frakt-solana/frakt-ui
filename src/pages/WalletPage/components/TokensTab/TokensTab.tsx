import { FC, useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getAllUserTokens } from 'solana-nft-metadata';
import { TokenInfo } from '@solana/spl-token-registry';
import { useHistory, useParams } from 'react-router-dom';
import { useConnection } from '@solana/wallet-adapter-react';

import { useTokenListContext } from '../../../../contexts/TokenList';
import { TokenInfoWithAmount } from '../../WalletPage';
import { Loader } from '../../../../components/Loader';
import { PATHS } from '../../../../constants';
import { FRKT_TOKEN } from '../../../../utils';
import { TokenCard } from '../TokenCard';
import styles from './styles.module.scss';

export const TokensTab: FC = () => {
  const [userTokens, setUserTokens] = useState<TokenInfoWithAmount[]>([]);
  const history = useHistory();
  const { fraktionTokensMap, loading: tokensLoading } = useTokenListContext();
  const { walletPubkey } = useParams<{ walletPubkey: string }>();
  const { connection } = useConnection();

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

  return (
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
          {userTokens
            .filter((token) => token.address !== FRKT_TOKEN.address)
            .map((token) => (
              <TokenCard key={token.address} token={token} />
            ))}
        </div>
      )}
    </>
  );
};
