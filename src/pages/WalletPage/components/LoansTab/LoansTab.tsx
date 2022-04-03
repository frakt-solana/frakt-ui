import { FC, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { Loader } from '../../../../components/Loader';
import { useUserTokens } from '../../../../contexts/userTokens';
import { LoansList } from '../LoansList';
import styles from './styles.module.scss';

export const LoansTab: FC = () => {
  const { connected } = useWallet();

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

  return (
    <>
      {nftsLoading ? (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      ) : (
        <LoansList nfts={rawNfts} />
      )}
    </>
  );
};
