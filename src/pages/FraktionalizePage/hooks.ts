import { useState } from 'react';

import { UserNFT, useUserTokens } from '../../contexts/userTokens';
import { useFraktion, VaultData } from '../../contexts/fraktion';

interface FraktionalizeTxnData {
  userNfts: UserNFT[];
  tickerName: string;
  pricePerFraction: number;
  fractionsAmount: number;
  basketName?: string;
  isAuction: boolean;
  tickSize: number;
  startBid: number;
  currentVault?: VaultData;
}

type ModalState = 'loading' | 'success' | 'fail';

export const useFraktionalizeTransactionModal = (): {
  visible: boolean;
  open: (txnData: FraktionalizeTxnData) => Promise<void>;
  close: () => void;
  state: ModalState;
  setState: (nextState: ModalState) => void;
  fractionTokenMint: string;
  tickerName: string;
} => {
  const { removeTokenOptimistic } = useUserTokens();
  const { createVault } = useFraktion();
  const [visible, setVisible] = useState<boolean>(false);
  const [state, setState] = useState<ModalState>('loading');
  const [fractionTokenMint, setFractionTokenMint] = useState<string>('');

  const [transactionData, setTransactionData] =
    useState<FraktionalizeTxnData>(null);

  const open = (txnData: FraktionalizeTxnData) => {
    setVisible(true);
    setTransactionData(txnData);
    return createSingleVault(txnData);
  };

  const createSingleVault = async (txnData: FraktionalizeTxnData) => {
    try {
      const fractionalMint = await createVault(
        txnData.userNfts,
        txnData.pricePerFraction,
        txnData.fractionsAmount,
        txnData.currentVault,
      );
      setState('success');
      setFractionTokenMint(fractionalMint);
      removeTokenOptimistic(txnData.userNfts.map((el) => el.mint));
    } catch (err) {
      setState('fail');
    }
  };

  const close = () => {
    setVisible(false);
    setFractionTokenMint('');
  };

  return {
    visible,
    open,
    close,
    state,
    setState,
    fractionTokenMint,
    tickerName: transactionData?.tickerName || '',
  };
};
