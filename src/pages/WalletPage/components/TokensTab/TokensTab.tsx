import { FC } from 'react';
import { TokenInfo } from '@solana/spl-token-registry';

import { Loader } from '../../../../components/Loader';
import { FRKT_TOKEN } from '../../../../utils';
import { TokenCard } from '../TokenCard';
import styles from './styles.module.scss';
import BN from 'bn.js';

export interface TokenInfoWithAmount extends TokenInfo {
  amountBN: BN;
}

interface TokensTab {
  userTokens: TokenInfoWithAmount[];
  loading: boolean;
}

export const TokensTab: FC<TokensTab> = ({ userTokens, loading }) => {
  return (
    <>
      {loading ? (
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
