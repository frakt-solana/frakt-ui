import { ProgramAccountData } from './../../../contexts/liquidityPools/liquidityPools.model';
import { getProgramAccountByRouter } from './../../../contexts/liquidityPools/liquidityPools.helpers';
import { useConnection } from '@solana/wallet-adapter-react';
import { useState } from 'react';

type FetchProgramAccount = (routerKey: string) => Promise<void>;

export const useLazyProgramAccount = (): {
  loading: boolean;
  programAccount: ProgramAccountData;
  fetchProgramAccountInfo: FetchProgramAccount;
} => {
  const { connection } = useConnection();
  const [loading, setLoading] = useState<boolean>(false);
  const [programAccount, setProgramAccount] = useState<ProgramAccountData>();

  const fetchProgramAccountInfo: FetchProgramAccount = async (
    routerKey: string,
  ) => {
    try {
      setLoading(true);

      const programAccountInfo = await getProgramAccountByRouter(
        routerKey,
        connection,
      );

      setProgramAccount(programAccountInfo);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { programAccount, loading, fetchProgramAccountInfo };
};
