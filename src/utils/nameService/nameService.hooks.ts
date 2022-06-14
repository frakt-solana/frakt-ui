import { web3 } from '@frakt-protocol/frakt-sdk';
import { useState } from 'react';
import { getNameServiceData } from './nameService';
import {
  NameServiceResponse,
  useNameServiceInfoType,
} from './nameService.model';

export const useNameServiceInfo: useNameServiceInfoType = () => {
  const [info, setInfo] = useState<NameServiceResponse>({
    domain: null,
    twitterHandle: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>(null);

  const getInfo = async (
    walletPublicKey: string,
    connection: web3.Connection,
  ): Promise<void> => {
    try {
      setLoading(true);
      const info = await getNameServiceData(walletPublicKey, connection);
      setInfo(info);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    info,
    getInfo,
  };
};
