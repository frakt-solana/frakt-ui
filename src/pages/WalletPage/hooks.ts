import { useEffect } from 'react';

import {
  NameServiceResponse,
  useNameServiceInfo,
} from '../../utils/nameService';
import { useConnection } from '../../hooks';

type UseNameService = (props: { walletPubkey: string }) => {
  nameServiceInfo: NameServiceResponse;
};

export const useNameService: UseNameService = ({ walletPubkey }) => {
  const connection = useConnection();

  const { info: nameServiceInfo, getInfo: getNameServiceInfo } =
    useNameServiceInfo();

  useEffect(() => {
    walletPubkey && getNameServiceInfo(walletPubkey, connection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletPubkey]);

  return {
    nameServiceInfo,
  };
};
